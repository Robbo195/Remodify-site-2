import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { listing } = location.state || {};

  if (!listing) {
    return (
      <div className="container mt-5">
        <h2 style={{ color: '#E63946' }}>No listing selected for checkout.</h2>
        <button className="btn btn-secondary mt-3" onClick={() => navigate('/results')}>Back to Results</button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm" style={{ borderRadius: '1rem', padding: '2rem' }}>
            <h2 className="mb-4" style={{ color: '#E63946', fontWeight: 700 }}>Checkout</h2>
            <div className="d-flex align-items-center mb-4">
              <img
                src={listing.imageUrl || 'https://via.placeholder.com/120x80'}
                alt={listing.title}
                style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: '0.5rem', marginRight: '1.5rem', background: '#fff' }}
              />
              <div>
                <h5 style={{ color: '#E63946', fontWeight: 600 }}>{listing.title}</h5>
                <div><strong>Price:</strong> ${listing.price}</div>
                <div><strong>Model:</strong> {listing.model}</div>
                <div><strong>Year:</strong> {listing.year}</div>
                <div><strong>Condition:</strong> {listing.condition}</div>
              </div>
            </div>
            <hr />
            <h5 className="mb-3">Contact Seller</h5>
            <p className="text-muted">Checkout functionality coming soon. Please contact the seller to arrange payment and delivery.</p>
            <button className="btn btn-outline-secondary mt-3" onClick={() => navigate('/results')}>Back to Results</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
