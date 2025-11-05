import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';

const SavedSearches = () => {
  const [savedSearches, setSavedSearches] = useState([]);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (!user) {
        // fallback to localStorage for unsigned users
        const searches = JSON.parse(localStorage.getItem('remodifySavedSearches') || '[]');
        setSavedSearches(searches);
        setLoading(false);
        return;
      }
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        const searches = snap.exists() && snap.data().savedSearches ? snap.data().savedSearches : [];
        setSavedSearches(searches);
      } catch (err) {
        console.error('Error loading saved searches', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleRerunSearch = (search) => {
    // Build query string from search object
    const params = new URLSearchParams();
    if (search.year) params.set('year', search.year);
    if (search.manufacturer) params.set('manufacturer', search.manufacturer);
    if (search.model) params.set('model', search.model);
    if (search.partNumber) params.set('partNumber', search.partNumber);
    if (search.keyword) params.set('keyword', search.keyword);
    navigate(`/results?${params.toString()}`);
  };

  const handleDeleteSearch = async (idx) => {
    const s = savedSearches[idx];
    if (!s) return;
    if (!user) {
      const updated = savedSearches.filter((_, i) => i !== idx);
      setSavedSearches(updated);
      localStorage.setItem('remodifySavedSearches', JSON.stringify(updated));
      return;
    }
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { savedSearches: arrayRemove(s) });
      setSavedSearches(prev => prev.filter((_, i) => i !== idx));
    } catch (err) {
      console.error('Error deleting saved search', err);
      alert('Could not delete saved search');
    }
  };

  if (loading) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <h2 style={{ color: '#E63946', fontWeight: 700 }}>Saved Searches</h2>
      {savedSearches.length === 0 ? (
        <p className="text-muted mt-4">You have no saved searches.</p>
      ) : (
        <div className="list-group mt-4">
          {savedSearches.map((search, idx) => (
            <div key={idx} className="list-group-item list-group-item-action mb-2" style={{ borderRadius: '1rem', border: '1px solid #E63946', background: '#fff7f7' }}>
              <div><strong>Date:</strong> {search.date ? new Date(search.date).toLocaleDateString() : ''}</div>
              <div><strong>Year:</strong> {search.year || 'Any'}</div>
              <div><strong>Manufacturer:</strong> {search.manufacturer || 'Any'}</div>
              <div><strong>Model:</strong> {search.model || 'Any'}</div>
              <div><strong>Part Number:</strong> {search.partNumber || 'Any'}</div>
              <div><strong>Keyword:</strong> {search.keyword || 'Any'}</div>
              <div className="mt-2 d-flex gap-2">
                <button className="btn btn-sm btn-outline-primary" style={{ borderRadius: '1rem', fontWeight: 600 }} onClick={() => handleRerunSearch(search)}>
                  Rerun Search
                </button>
                <button className="btn btn-sm btn-outline-danger" style={{ borderRadius: '1rem', fontWeight: 600 }} onClick={() => handleDeleteSearch(idx)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedSearches;
