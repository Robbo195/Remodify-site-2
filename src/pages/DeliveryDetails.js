import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DeliveryPaymentDetails = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    postcode: '',
    country: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    alert('Payment and delivery details submitted! (Demo only)');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm" style={{ borderRadius: '1rem', padding: '2rem' }}>
            <h2 className="mb-4" style={{ color: '#E63946', fontWeight: 700 }}>Delivery & Payment Details</h2>
            <form onSubmit={handleSubmit}>
              <h5 style={{ color: '#E63946', fontWeight: 600 }}>Delivery Information</h5>
              <div className="mb-3">
                <input className="form-control" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <input className="form-control" name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <input className="form-control" name="city" placeholder="City" value={form.city} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <input className="form-control" name="postcode" placeholder="Postcode" value={form.postcode} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <input className="form-control" name="country" placeholder="Country" value={form.country} onChange={handleChange} required />
              </div>
              <h5 className="mt-4 mb-2" style={{ color: '#E63946', fontWeight: 600 }}>Payment Details</h5>
              <div className="mb-3">
                <input className="form-control" name="cardNumber" placeholder="Card Number" value={form.cardNumber} onChange={handleChange} required />
              </div>
              <div className="row mb-3">
                <div className="col">
                  <input className="form-control" name="expiry" placeholder="Expiry (MM/YY)" value={form.expiry} onChange={handleChange} required />
                </div>
                <div className="col">
                  <input className="form-control" name="cvc" placeholder="CVC" value={form.cvc} onChange={handleChange} required />
                </div>
              </div>
              <button type="submit" className="btn" style={{ backgroundColor: '#E63946', color: 'white', fontWeight: 600, borderRadius: '2rem', padding: '0.7rem 2.5rem', fontSize: '1.15rem' }}>
                Submit
              </button>
              <button type="button" className="btn btn-outline-secondary ms-3" style={{ borderRadius: '2rem', fontWeight: 600 }} onClick={() => navigate('/checkout')}>
                Back to Checkout
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPaymentDetails;
