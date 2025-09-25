import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ListingSuccess = () => {
  const location = useLocation();
  const { listingTitle } = location.state || {};

  return (
    <div className="page-section d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 100px)', background: '#f8f9fa' }}>
      <div className="container text-center" style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 12px rgba(230,57,70,0.07)', padding: '2rem' }}>
        <h1 className="title-underline-1" style={{ color: '#E63946', fontWeight: 700 }}>Listing Created Successfully!</h1>
        <p className="lead">
          {listingTitle ? `Your item "${listingTitle}" has been successfully listed on Remodify.` : 'Your item has been successfully listed on Remodify.'}
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Link to="/" className="btn" style={{ backgroundColor: 'rgb(255, 102, 0)', color: 'white', fontWeight: 600, borderRadius: '2rem', padding: '0.5rem 2rem' }}>Go to Home</Link>
          <Link to="/create-listing" className="btn" style={{ backgroundColor: '#E63946', color: 'white', fontWeight: 600, borderRadius: '2rem', padding: '0.5rem 2rem' }}>Create New Listing</Link>
        </div>
      </div>
    </div>
  );
};

export default ListingSuccess;
