import React, { useEffect, useState } from 'react';
import Fuse from 'fuse.js';

const Results = () => {
  const [results, setResults] = useState([]);
  const [searchInputs, setSearchInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default 5 per page

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  useEffect(() => {
    const loadInventoryAndSearch = async () => {
      try {
        const response = await fetch("/parts.json");
        if (!response.ok) {
          throw new Error(`Failed to fetch parts: ${response.statusText}`);
        }
        const inventory = await response.json();

        const params = new URLSearchParams(window.location.search);
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
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const paginatedResults = results.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderResults = () => {
    if (loading) return <p>Loading results...</p>;
    if (error) return <p>Error: {error}</p>;
    if (results.length === 0) return <p>No parts matched your search.</p>;

    return (
      <>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {paginatedResults.map(({ item, score }) => {
            const isCloseMatch = score <= 0.3;

            return (
              <div className="col" key={item.partNumber}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={item.imageUrl || "https://via.placeholder.com/32x32"}
                    className="card-img-top"
                    alt={item.title}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{item.title || "Untitled listing"}</h5>
                    <p className="card-text">{item.description}</p>
                    <p className="card-text fw-bold">${item.price?.toFixed(2) || "0.00"}</p>
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      {isCloseMatch && (
                        <span className="badge bg-warning text-dark">Close Match</span>
                      )}
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleViewItem(item)}
                      >
                        View Item
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        {showModal && selectedItem && (
          <div
            className="modal show fade d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onClick={() => setShowModal(false)}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedItem.title}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body text-center">
                  <img
                    src={selectedItem.imageUrl || "https://via.placeholder.com/400x250"}
                    alt={selectedItem.title}
                    className="img-fluid mb-3"
                  />
                  <h4>${selectedItem.price?.toFixed(2)}</h4>
                  {searchInputs.partNumber && (
                    <p className="text-muted">Part #: {selectedItem.partNumber}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
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
              setCurrentPage(1); // Reset to page 1 on change
            }}
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
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            className="btn btn-sm btn-outline-secondary ms-2"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="page-section">
      <div className="container text-start">
        <h1 className="title-underline-1">Results</h1>
        <p className="fst-italic">
          You searched for a {searchInputs.year} {searchInputs.manufacturer} {searchInputs.model} {searchInputs.partNumber && `part number ${searchInputs.partNumber}`} {searchInputs.keyword && `(${searchInputs.keyword})`}.
        </p>
        <div id="resultsContainer">
          {renderResults()}
        </div>
        {renderPaginationControls()}

        {/* Modal */}
        {showModal && selectedItem && (
          <div
            className="modal show fade d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onClick={() => setShowModal(false)}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedItem.title}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body text-center">
                  <img
                    src={selectedItem.imageUrl || "https://via.placeholder.com/400x250"}
                    alt={selectedItem.title}
                    className="img-fluid mb-3"
                  />
                  <h4>${selectedItem.price?.toFixed(2)}</h4>
                  {searchInputs.partNumber && (
                    <p className="text-muted">Part #: {selectedItem.partNumber}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
