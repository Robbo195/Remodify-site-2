import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const ListingSuccess = () => {
  const location = useLocation();
  const { listingTitle, listingId, matchedBuyers } = location.state || {};

  return (
    <div className="page-section d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 100px)', background: '#f8f9fa' }}>
      <div className="container text-center" style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 12px rgba(230,57,70,0.07)', padding: '2rem' }}>
        <h1 className="title-underline-1" style={{ color: '#E63946', fontWeight: 700 }}>Listing Created Successfully!</h1>
        <p className="lead">
          {listingTitle ? `Your item "${listingTitle}" has been successfully listed on ModRex.` : 'Your item has been successfully listed on Remodify.'}
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Link to="/" className="btn" style={{ backgroundColor: 'rgb(255, 102, 0)', color: 'white', fontWeight: 600, borderRadius: '2rem', padding: '0.5rem 2rem' }}>See My Listings </Link>
          <Link to="/create-listing" className="btn" style={{ backgroundColor: '#E63946', color: 'white', fontWeight: 600, borderRadius: '2rem', padding: '0.5rem 2rem' }}>Create New Listing</Link>
        </div>
          {matchedBuyers && matchedBuyers.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h4 style={{ color: '#333' }}>Potential buyers we matched</h4>
              <ul>
                {matchedBuyers.map((mb) => (
                  <li key={mb.id} style={{ margin: '8px 0' }}>
                    Buyer want id: {mb.id} — score: {mb.score}
                    <button
                      onClick={async () => {
                        await addDoc(collection(db, 'buyer_notifications'), {
                          buyerId: mb.id,
                          wantId: mb.id,
                          listingId: listingId || null,
                          score: mb.score,
                          createdAt: serverTimestamp(),
                          notified: true,
                          method: 'seller-click'
                        });
                        alert('Buyer notified (in-app). Email will be sent by backend.');
                      }}
                      style={{ marginLeft: 12, padding: '6px 10px', borderRadius: 6, border: 'none', background: '#E63946', color: 'white' }}
                    >Notify buyer</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>
    </div>
  );
};

export default ListingSuccess;
