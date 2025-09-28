import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const SavedListings = () => {
  const [user, setUser] = useState(null);
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchSavedListings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        const savedIds = userSnap.exists() && userSnap.data().savedListings ? userSnap.data().savedListings : [];
        if (savedIds.length === 0) {
          setSavedListings([]);
          setLoading(false);
          return;
        }
        // Fetch all listings
        const listingsSnap = await getDocs(collection(db, 'listings'));
        const allListings = listingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Filter to only saved
        const filtered = allListings.filter(listing => savedIds.includes(listing.id));
        setSavedListings(filtered);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedListings();
  }, [user]);

  if (!user) {
    return <div className="container mt-5"><h2 style={{ color: '#E63946' }}>Saved Listings</h2><p>Please log in to view your saved listings.</p></div>;
  }

  return (
    <div className="container mt-5">
      <h2 style={{ color: '#E63946', fontWeight: 700, marginBottom: '2rem' }}>Saved Listings</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && savedListings.length === 0 && <p>You have no saved listings yet.</p>}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {savedListings.map(listing => (
          <div className="col" key={listing.id}>
            <div className="card h-100 shadow-sm" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
              <img
                src={listing.imageUrl || 'https://via.placeholder.com/32x32'}
                className="card-img-top"
                alt={listing.title}
                style={{ objectFit: 'cover', height: '200px' }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title" style={{ fontWeight: 600, color: '#E63946' }}>{listing.title || 'Untitled listing'}</h5>
                <p className="card-text">{listing.description}</p>
                <p className="card-text fw-bold" style={{ color: '#E63946' }}>${listing.price?.toFixed(2) || '0.00'}</p>
                <div className="mt-auto">
                  <span className="badge bg-secondary">{listing.model} | {listing.year}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedListings;
