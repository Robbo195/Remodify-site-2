import React, { useEffect, useState } from 'react';
import Fuse from 'fuse.js';
import { useLocation, useNavigate } from 'react-router-dom';

import { collection, getDocs, doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Results = () => {
  const [results, setResults] = useState([]);
  const [searchInputs, setSearchInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default 5 per page
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const navigate = useNavigate();

  // Filtering and sorting state
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    condition: ''
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [maxPrice, setMaxPrice] = useState(10000);

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const newListing = location.state && location.state.newListing;

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadInventoryAndSearch = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "listings"));
        let inventory = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // If a new listing was just posted, show it at the top (if not already in Firestore results)
        if (newListing) {
          // Check if it's already in inventory (by title, description, etc.)
          const alreadyExists = inventory.some(item =>
            item.title === newListing.title &&
            item.description === newListing.description &&
            item.price === newListing.price &&
            item.manufacturer === newListing.manufacturer &&
            item.model === newListing.model &&
            item.year === newListing.year
          );
          if (!alreadyExists) {
            inventory = [
              { ...newListing, id: 'new', imageUrl: newListing.files && newListing.files[0] },
              ...inventory
            ];
          }
        }

        const search = {
          year: params.get("year") || "",
          manufacturer: params.get("manufacturer") || "",
          model: params.get("model") || "",
          partNumber: params.get("partNumber") || "",
          keyword: params.get("keyword") || ""
        };
        setSearchInputs(search);

        const searchString = Object.values(search).filter(Boolean).join(" ").toLowerCase();

        const fuse = new Fuse(inventory, {
          keys: [
            { name: "year", weight: 0.15 },
            { name: "manufacturer", weight: 0.25 },
            { name: "model", weight: 0.25 },
            { name: "partNumber", weight: 0.2 },
            { name: "description", weight: 0.15 }
          ],
          threshold: 0.4,
          includeScore: true
        });

        const searchResults = searchString
          ? fuse.search(searchString)
          : inventory.map(item => ({ item, score: 0 }));

        setResults(searchResults);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadInventoryAndSearch();
  }, [location]);

  // Save listing handler
  const handleSaveListing = async (listing) => {
    if (!user) {
      alert('Please log in to save listings.');
      return;
    }
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {}, { merge: true }); // Ensure user doc exists
      await updateDoc(userRef, {
        savedListings: arrayUnion(listing.id)
      });
      alert('Listing saved!');
    } catch (err) {
      alert('Error saving listing.');
    }
  };

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('remodifyCart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('remodifyCart', JSON.stringify(cart));
    // Notify App.js of cart changes
    const event = new CustomEvent('remodify-cart-update', { detail: { count: cart.length } });
    window.dispatchEvent(event);
  }, [cart]);

  // Add to cart handler
  const handleAddToCart = (item) => {
    setCart(prevCart => {
      // Prevent duplicates by id
      if (prevCart.some(cartItem => cartItem.id === item.id)) return prevCart;
      return [...prevCart, item];
    });
  };

  // Save search handler
  const handleSaveSearch = () => {
    const searchToSave = { ...searchInputs, date: new Date().toISOString() };
    let searches = JSON.parse(localStorage.getItem('remodifySavedSearches') || '[]');
    searches.push(searchToSave);
    localStorage.setItem('remodifySavedSearches', JSON.stringify(searches));
    setSavedSearches(searches);
    alert('Search saved!');
  };

  // Load saved searches from localStorage on mount
  useEffect(() => {
    const searches = JSON.parse(localStorage.getItem('remodifySavedSearches') || '[]');
    setSavedSearches(searches);
  }, []);

  // Dynamically determine max price from listings
  const getMaxListingPrice = (items) => {
    if (!items.length) return 1000;
    return Math.max(...items.map(i => Number(i.price) || 0), 1000);
  };
  const allItems = results.map(r => r.item);
  const dynamicMax = getMaxListingPrice(allItems);
  useEffect(() => {
    setMaxPrice(dynamicMax);
    // eslint-disable-next-line
  }, [dynamicMax]);

  // Filtering and sorting logic
  const applyFiltersAndSort = (items) => {
    let filtered = items;
    filtered = filtered.filter(i => Number(i.price) >= 0 && Number(i.price) <= maxPrice);
    if (filters.condition) filtered = filtered.filter(i => i.condition === filters.condition);
    if (sortBy === 'price-asc') filtered = filtered.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') filtered = filtered.sort((a, b) => b.price - a.price);
    if (sortBy === 'year-desc') filtered = filtered.sort((a, b) => b.year - a.year);
    if (sortBy === 'year-asc') filtered = filtered.sort((a, b) => a.year - b.year);
    // Default: relevance (Fuse score order)
    return filtered;
  };

  // Pagination logic
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const paginatedResults = applyFiltersAndSort(results.map(r => r.item)).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderResults = () => {
    if (loading) return <p>Loading results...</p>;
    if (error) return <p>Error: {error}</p>;
    if (results.length === 0 && !newListing) return <p>No parts matched your search.</p>;

    return (
      <>
        {newListing && (
          <div className="row mb-4">
            <div className="col">
              <div className="card h-100 shadow-sm" style={{ borderRadius: '1rem', overflow: 'hidden', border: '2px solid #E63946', background: '#fff7f7' }}>
                <img
                  src={newListing.files && newListing.files[0] ? newListing.files[0] : "https://via.placeholder.com/32x32"}
                  className="card-img-top"
                  alt={newListing.title}
                  style={{ objectFit: 'cover', height: '200px' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title" style={{ fontWeight: 600, color: '#E63946' }}>{newListing.title || "Untitled listing"}</h5>
                  <div className="mb-2"><strong>Price:</strong> ${newListing.price}</div>
                  <div className="mb-2"><strong>Manufacturer:</strong> {newListing.manufacturer}</div>
                  <div className="mb-2"><strong>Model:</strong> {newListing.model}</div>
                  <div className="mb-2"><strong>Year:</strong> {newListing.year}</div>
                  <div className="mb-2"><strong>Condition:</strong> {newListing.condition}</div>
                  <div className="mb-2"><strong>Description:</strong> {newListing.description}</div>
                  <div className="mb-2"><strong>Negotiable:</strong> {newListing.negotiable ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {paginatedResults.map((item) => (
            <div className="col" key={item.partNumber}>
              <div className="card h-100 shadow-sm" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                <img
                  src={item.imageUrl || "https://via.placeholder.com/32x32"}
                  className="card-img-top"
                  alt={item.title}
                  style={{ objectFit: 'cover', height: '200px' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title" style={{ fontWeight: 600, color: '#E63946' }}>{item.title || "Untitled listing"}</h5>
                  <p className="card-text">{item.description}</p>
                  <p className="card-text fw-bold" style={{ color: '#E63946' }}>${item.price?.toFixed(2) || "0.00"}</p>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-sm me-2"
                      style={{ background: '#FF6600', color: 'white', fontWeight: 'bold', border: '2px solid #FF6600', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(230,57,70,0.08)' }}
                      onClick={() => handleSaveListing(item)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{ backgroundColor: "#E63946", color: "white", borderRadius: '1rem' }}
                      onClick={() => handleViewItem(item)}
                    >
                      View Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderPaginationControls = () => {
    if (results.length <= itemsPerPage) return null;

    return (
      <div className="d-flex justify-content-between align-items-center mt-4">
        <div>
          <label className="me-2">Items per page:</label>
          <select
            value={itemsPerPage}
            onChange={e => {
              setItemsPerPage(parseInt(e.target.value));
              setCurrentPage(1); /* Reset to page 1 on change */
            }}
            style={{ borderRadius: '1rem' }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div>
          <button
            className="btn btn-sm btn-outline-secondary me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            style={{ borderRadius: '1rem' }}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            className="btn btn-sm btn-outline-secondary ms-2"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            style={{ borderRadius: '1rem' }}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  /* Filtering UI (sidebar) */
  const renderFilters = () => (
    <div className="p-3 mb-3" style={{
      background: '#f8f9fa', /* match page background */
      border: '1px solid #e5e5e5', /* lighter border */
      borderRadius: '1rem',
      marginLeft: '-2px',
      width: 'calc(100% + 4px)',
      maxWidth: 200,
      boxShadow: 'none',
    }}>
      <h5 style={{ color: '#B01C1C', fontWeight: 600 }}>Filter</h5>
      <div className="mb-4">
        <label className="form-label" style={{ color: '#888' }}>Price</label>
        <div className="d-flex align-items-center gap-2">
          <span style={{ minWidth: 28, color: '#bbb' }}>$0</span>
          <input
            type="range"
            min={0}
            max={dynamicMax}
            step={50}
            value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
            className="form-range flex-grow-1"
          />
          <span style={{ minWidth: 28, color: '#bbb' }}>{maxPrice === dynamicMax ? 'Max' : `$${maxPrice}`}</span>
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label" style={{ color: '#888' }}>Condition</label>
        <select className="form-select" value={filters.condition} onChange={e => setFilters(f => ({ ...f, condition: e.target.value }))}>
          <option value="">Any</option>
          <option value="New">New</option>
          <option value="Used">Used</option>
          <option value="Refurbished">Refurbished</option>
        </select>
      </div>
    </div>
  );

  /* Sort By UI (top right) */
  const renderSortBy = () => (
    <div className="d-flex justify-content-end align-items-center mb-3">
      <button
        className="btn"
        style={{
          background: 'white',
          color: '#FF6A13', // Remodify orange text
          borderRadius: '1rem',
          fontWeight: 600,
          marginRight: '1rem',
          border: '2px solid #FF6A13',
          boxShadow: '0 2px 8px rgba(255,106,19,0.10)'
        }}
        onClick={handleSaveSearch}
        disabled={Object.values(searchInputs).every(val => !val)}
      >
        Save Search
      </button>
      <label className="form-label me-2 mb-0">Sort By</label>
      <select className="form-select w-auto" value={sortBy} onChange={e => setSortBy(e.target.value)}>
        <option value="relevance">Relevance</option>
        <option value="price-asc">Price ↑</option>
        <option value="price-desc">Price ↓</option>
        <option value="year-desc">Year ↓</option>
        <option value="year-asc">Year ↑</option>
      </select>
    </div>
  );

  const [showContactBox, setShowContactBox] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);

  return (
    <div className="page-section" style={{ background: '#f9f9fa', minHeight: '100vh' }}>
      <div className="row g-0" style={{ margin: 0 }}>
        {/* Sidebar flush left, add top margin to align with results */}
        <div
          className="col-12 col-md-2"
          style={{
            minWidth: 220,
            paddingLeft: 0,
            paddingRight: 0,
            background: '#f8f9fa',
            marginTop: '6.5rem' // aligns with header + search summary + sort bar
          }}
        >
          {renderFilters()}
        </div>
        <div className="col-12 col-md-10" style={{ paddingLeft: 0 }}>
          <div className="container text-start" style={{ paddingLeft: 0, paddingRight: 0 }}>
            <h1 className="title-underline-1" style={{ fontWeight: 700, color: '#E63946', marginBottom: '2rem', marginTop: '2.5rem' }}>Results</h1>
            {Object.values(searchInputs).some(input => input) && (
              <div className="p-3 mb-4 rounded" style={{ background: '#fff3f3', border: '1px solid #E63946', color: '#E63946' }}>
                <span className="fst-italic">
                  You searched for a {searchInputs.year} {searchInputs.manufacturer} {searchInputs.model} {searchInputs.partNumber && `part number ${searchInputs.partNumber}`} {searchInputs.keyword && `(${searchInputs.keyword})`}.
                </span>
              </div>
            )}
            {renderSortBy()}
            <div id="resultsContainer">
              {renderResults()}
            </div>
            {renderPaginationControls()}
          </div>
        </div>
      </div>
      {/* Modal */}
      {showModal && selectedItem && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => { setShowModal(false); setShowContactBox(false); setContactSuccess(false); }}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content" style={{ border: '2px solid #E63946', borderRadius: '1rem' }}>
              <div className="modal-header" style={{ background: '#f8f9fa' }}>
                <h5 className="modal-title" style={{ color: '#E63946', fontWeight: 600 }}>
                  {selectedItem.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setShowContactBox(false);
                    setContactSuccess(false);
                  }}
                />
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 text-start d-flex flex-column">
                    <div>
                      {searchInputs.partNumber && (
                        <p className="text-muted">Part #: {selectedItem.partNumber}</p>
                      )}
                      <p><strong>Model:</strong> {selectedItem.model}</p>
                      <p><strong>Year:</strong> {selectedItem.year}</p>
                      <p><strong>Description:</strong> {selectedItem.description}</p>
                    </div>
                    <div className="mt-auto text-start">
                      <h4 style={{ color: '#E63946', fontWeight: 700 }}>
                        ${selectedItem.price?.toFixed(2)}
                        {selectedItem.negotiable ? (
                          <small className="text-muted fst-italic ms-2">negotiable</small>
                        ) : (
                          <small className="text-muted fst-italic ms-2">Fixed price</small>
                        )}
                      </h4>
                    </div>
                  </div>
                  <div className="col-md-6 d-flex flex-column">
                    <img
                      src={selectedItem.imageUrl || "https://via.placeholder.com/400x250"}
                      alt={selectedItem.title}
                      className="img-fluid rounded shadow-sm"
                      style={{ objectFit: 'cover', maxHeight: '300px', background: '#fff' }}
                    />
                    <div className="mt-auto pt-3 text-end">
                      {!showContactBox && (
                        <button
                          type="button"
                          className="btn me-2"
                          style={{ backgroundColor: "#FF6600", color: "white", fontWeight: 600, borderRadius: '2rem', padding: '0.5rem 2rem' }}
                          onClick={() => setShowContactBox(true)}
                        >
                          Contact Seller
                        </button>
                      )}
                      {showContactBox && (
                        <div className="mb-2 text-start">
                          <textarea
                            className="form-control mb-2"
                            rows={3}
                            placeholder="Type your message to the seller..."
                            value={contactMessage}
                            onChange={e => setContactMessage(e.target.value)}
                          />
                          <button
                            className="btn btn-primary"
                            style={{ backgroundColor: '#E63946', borderRadius: '1rem', fontWeight: 600 }}
                            onClick={() => {
                              let messages = JSON.parse(localStorage.getItem('remodifySellerMessages') || '[]');
                              messages.push({
                                from: 'buyer',
                                message: contactMessage,
                                date: new Date().toISOString(),
                                listingId: selectedItem.id
                              });
                              localStorage.setItem('remodifySellerMessages', JSON.stringify(messages));
                              setContactSuccess(true);
                              setContactMessage("");
                              setShowContactBox(false);
                            }}
                            disabled={!contactMessage.trim()}
                          >
                            Send Message
                          </button>
                        </div>
                      )}
                      {contactSuccess && (
                        <div className="alert alert-success mt-2">Message sent to seller!</div>
                      )}
                      <button
                        type="button"
                        className="btn"
                        style={{ backgroundColor: "#E63946", color: "white", fontWeight: 600, borderRadius: '2rem', padding: '0.5rem 2rem' }}
                        onClick={() => {
                          handleAddToCart(selectedItem);
                          setShowModal(false);
                          window.scrollTo(0, 0);
                          navigate('/checkout', { state: { cart: [...cart, selectedItem] } });
                        }}
                      >
                        I have to have it!
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Results;