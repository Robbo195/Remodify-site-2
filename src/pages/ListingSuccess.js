import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { addDoc, collection, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Card, Button, Spinner } from 'react-bootstrap';

const ListingSuccess = () => {
  const location = useLocation();
  const { listingTitle, listingId, matchedBuyers } = location.state || {};
  const [matchedWants, setMatchedWants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWantDetails = async () => {
      if (!matchedBuyers || matchedBuyers.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const wantDetails = await Promise.all(
          matchedBuyers.map(async (mb) => {
            const wantRef = doc(db, 'wants', mb.id);
            const wantSnap = await getDoc(wantRef);
            if (wantSnap.exists()) {
              return {
                id: mb.id,
                score: mb.score,
                ...wantSnap.data()
              };
            }
            return null;
          })
        );
        // Filter out null values and only keep matches with score >= 6
        setMatchedWants(wantDetails.filter(w => w !== null && w.score >= 6));
      } catch (error) {
        console.error('Error fetching want details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWantDetails();
  }, [matchedBuyers]);

  const handleNotifyBuyer = async (want) => {
    try {
      await addDoc(collection(db, 'buyer_notifications'), {
        buyerId: want.userId,
        wantId: want.id,
        listingId: listingId || null,
        score: want.score,
        createdAt: serverTimestamp(),
        notified: true,
        method: 'seller-click'
      });
      alert('Buyer notified! They will receive a notification about your listing.');
    } catch (error) {
      console.error('Error notifying buyer:', error);
      alert('Failed to notify buyer. Please try again.');
    }
  };

  return (
    <div className="page-section d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 100px)', background: '#f8f9fa', fontFamily: 'Inter, sans-serif' }}>
      <div className="container text-center" style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 12px rgba(230,57,70,0.07)', padding: '2rem' }}>
        <h1 className="title-underline-1" style={{ color: '#E63946', fontWeight: 700 }}>Listing Created Successfully!</h1>
        <p className="lead">
          {listingTitle ? `Your item "${listingTitle}" has been successfully listed on ModRex.` : 'Your item has been successfully listed on Remodify.'}
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Link to="/my-listings" className="btn" style={{ backgroundColor: 'rgb(255, 102, 0)', color: 'white', fontWeight: 600, borderRadius: '2rem', padding: '0.5rem 2rem' }}>See My Listings </Link>
          <Link to="/create-listing" className="btn" style={{ backgroundColor: '#E63946', color: 'white', fontWeight: 600, borderRadius: '2rem', padding: '0.5rem 2rem' }}>Create New Listing</Link>
        </div>

        {matchedBuyers && matchedBuyers.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h4 style={{ color: '#E63946', fontWeight: 600, marginBottom: '1rem' }}>
              Potential Buyers Interested in Your Item
            </h4>
            <p className="text-muted" style={{ fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              We found {matchedWants.length} buyer{matchedWants.length !== 1 ? 's' : ''} looking for items similar to yours.
              {matchedWants.length > 0 && ' Click "Notify Buyer" to let them know about your listing!'}
            </p>

            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" variant="danger" />
                <p className="mt-2 text-muted">Loading buyer details...</p>
              </div>
            ) : (
              <div className="row g-3">
                {matchedWants.map((want) => (
                  <div key={want.id} className="col-12 col-md-6">
                    <Card style={{ borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e9e9e9' }}>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 style={{ color: '#E63946', fontWeight: 600, margin: 0 }}>
                            WTB Request
                          </h6>
                          <span style={{ 
                            background: want.score >= 5 ? '#28a745' : want.score >= 3 ? '#ffc107' : '#6c757d',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            fontSize: '0.85rem',
                            fontWeight: 600
                          }}>
                            Match: {want.score}/10
                          </span>
                        </div>
                        
                        <div className="mt-3" style={{ fontSize: '0.9rem' }}>
                          <p className="mb-2">
                            <strong>Price Range:</strong> ${want.minPrice} - ${want.maxPrice}
                          </p>
                          {want.desiredCategory && (
                            <p className="mb-2">
                              <strong>Category:</strong> {want.desiredCategory}
                            </p>
                          )}
                          {want.preferredCondition && (
                            <p className="mb-2">
                              <strong>Condition:</strong> {want.preferredCondition}
                            </p>
                          )}
                          {want.desiredManufacturer && (
                            <p className="mb-2">
                              <strong>Manufacturer:</strong> {want.desiredManufacturer}
                            </p>
                          )}
                          {want.desiredPartNumber && (
                            <p className="mb-2">
                              <strong>Part Number:</strong> {want.desiredPartNumber}
                            </p>
                          )}
                        </div>

                        <Button
                          onClick={() => handleNotifyBuyer(want)}
                          style={{
                            backgroundColor: '#E63946',
                            borderColor: '#E63946',
                            color: 'white',
                            fontWeight: 600,
                            borderRadius: '1.5rem',
                            padding: '0.5rem 1.5rem',
                            width: '100%',
                            marginTop: '0.75rem'
                          }}
                        >
                          Notify This Buyer
                        </Button>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingSuccess;
