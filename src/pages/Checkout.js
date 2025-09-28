import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let cart = location.state?.cart;

  // Always load cart from localStorage for consistency
  const storedCart = localStorage.getItem('remodifyCart');
  cart = storedCart ? JSON.parse(storedCart) : cart || [];

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  if (!cart || cart.length === 0) {
    return (
      <div className="container mt-5">
        <h2 style={{ color: '#E63946' }}>No items in your cart.</h2>
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
            {cart.map((listing, idx) => (
              <div key={listing.id || idx} className="d-flex align-items-center mb-4">
                <img
                  src={listing.imageUrl || 'https://via.placeholder.com/120x80'}
                  alt={listing.title}
                  style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: '0.5rem', marginRight: '1.5rem', background: '#fff' }}
                />
                <div style={{ flex: 1 }}>
                  <h5 style={{ color: '#E63946', fontWeight: 600 }}>{listing.title}</h5>
                  <div><strong>Price:</strong> ${listing.price}</div>
                  <div><strong>Model:</strong> {listing.model}</div>
                  <div><strong>Year:</strong> {listing.year}</div>
                  <div><strong>Condition:</strong> {listing.condition}</div>
                </div>
                <button
                  className="btn btn-sm btn-outline-danger ms-3"
                  style={{ borderRadius: '1rem', fontWeight: 600 }}
                  onClick={() => {
                    const newCart = cart.filter((_, i) => i !== idx);
                    localStorage.setItem('remodifyCart', JSON.stringify(newCart));
                    window.location.reload();
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            {cart.length > 0 && (
              <div className="d-flex justify-content-end align-items-center mb-3">
                <span style={{ fontWeight: 600, fontSize: '1.2rem', color: '#222' }}>
                  Total: ${cart.reduce((sum, item) => sum + Number(item.price || 0), 0).toFixed(2)}
                </span>
                <button
                  className="btn btn-sm btn-outline-secondary ms-4"
                  style={{ borderRadius: '1rem', fontWeight: 600 }}
                  onClick={() => {
                    localStorage.removeItem('remodifyCart');
                    window.location.reload();
                  }}
                >
                  Clear Cart
                </button>
              </div>
            )}
            <hr />
            <button className="btn btn-outline-secondary mt-3" onClick={() => navigate('/results')}>Back to Results</button>
            <button
              className="btn mt-3"
              style={{ backgroundColor: '#E63946', color: 'white', fontWeight: 600, borderRadius: '2rem', padding: '0.7rem 2.5rem', fontSize: '1.15rem' }}
              onClick={() => navigate('/delivery-details')}
            >
              Proceed to Payment and Shipping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
