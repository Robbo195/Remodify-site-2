import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ListingSuccess = () => {
  const location = useLocation();
  const { listingTitle } = location.state || {};

  return (
    <div className="page-section d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
      <div className="container text-center">
        <h1 className="title-underline-1">Listing Created Successfully!</h1>
        <p className="lead">
          {listingTitle ? `Your item "${listingTitle}" has been successfully listed on Remodify.` : 'Your item has been successfully listed on Remodify.'}
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Link to="/" className="btn" style={{ backgroundColor: 'rgb(255, 102, 0)', color: 'white' }}>Go to Home</Link>
          <Link to="/create-listing" className="btn" style={{ backgroundColor: 'rgb(198, 32, 32)', color: 'white' }}>Create New Listing</Link>
        </div>
      </div>
    </div>
  );
};

export default ListingSuccess;
