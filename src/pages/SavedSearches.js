import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SavedSearches = () => {
  const [savedSearches, setSavedSearches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const searches = JSON.parse(localStorage.getItem('remodifySavedSearches') || '[]');
    setSavedSearches(searches);
  }, []);

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

  const handleDeleteSearch = (idx) => {
    const updated = savedSearches.filter((_, i) => i !== idx);
    setSavedSearches(updated);
    localStorage.setItem('remodifySavedSearches', JSON.stringify(updated));
  };

  return (
    <div className="container mt-5">
      <h2 style={{ color: '#E63946', fontWeight: 700 }}>Saved Searches</h2>
      {savedSearches.length === 0 ? (
        <p className="text-muted mt-4">You have no saved searches.</p>
      ) : (
        <div className="list-group mt-4">
          {savedSearches.map((search, idx) => (
            <div key={idx} className="list-group-item list-group-item-action mb-2" style={{ borderRadius: '1rem', border: '1px solid #E63946', background: '#fff7f7' }}>
              <div><strong>Date:</strong> {new Date(search.date).toLocaleString()}</div>
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
