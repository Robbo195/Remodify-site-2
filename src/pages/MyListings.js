import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const MyListings = () => {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchMyListings = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const q = query(collection(db, 'listings'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        const userListings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setListings(userListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyListings();
    }
  }, [user]);

  const handleDelete = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      await deleteDoc(doc(db, 'listings', listingId));
      setListings(listings.filter(listing => listing.id !== listingId));
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container className="text-center" style={{ minHeight: '60vh', paddingTop: '5rem' }}>
        <Spinner animation="border" variant="danger" />
        <p className="mt-3">Loading your listings...</p>
      </Container>
    );
  }

  return (
    <div className="page-section" style={{ background: '#f8f9fa', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '3rem' }}>
      <Container>
        <h1 className="title-underline-2 text-left" style={{ color: '#E63946', fontWeight: 700, marginBottom: '2rem' }}>
          My Listings
        </h1>

        {listings.length === 0 ? (
          <div className="text-center" style={{ padding: '3rem 0' }}>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>You haven't created any listings yet.</p>
          </div>
        ) : (
          <Row>
            {listings.map((listing) => (
              <Col key={listing.id} md={6} lg={4} className="mb-4">
                <Card style={{ borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <Card.Img
                    variant="top"
                    src={listing.imageUrl || 'https://via.placeholder.com/400x250'}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title style={{ color: '#E63946', fontWeight: 600, fontSize: '1.2rem' }}>
                      {listing.title}
                    </Card.Title>
                    <Card.Text style={{ color: '#666', marginBottom: '0.5rem' }}>
                      <strong>Price:</strong> ${listing.price}
                      {listing.negotiable && <span style={{ color: '#28a745', marginLeft: '0.5rem' }}>(Negotiable)</span>}
                    </Card.Text>
                    <Card.Text style={{ color: '#666', marginBottom: '0.5rem' }}>
                      <strong>Manufacturer:</strong> {listing.manufacturer}
                    </Card.Text>
                    <Card.Text style={{ color: '#666', marginBottom: '0.5rem' }}>
                      <strong>Model:</strong> {listing.model}
                    </Card.Text>
                    {listing.year && (
                      <Card.Text style={{ color: '#666', marginBottom: '0.5rem' }}>
                        <strong>Year:</strong> {listing.year}
                      </Card.Text>
                    )}
                    <Card.Text style={{ color: '#666', marginBottom: '0.5rem' }}>
                      <strong>Condition:</strong> {listing.condition}
                    </Card.Text>
                    <Card.Text style={{ color: '#666', marginBottom: '0.5rem' }}>
                      <strong>Category:</strong> {listing.category}
                    </Card.Text>
                    <Card.Text style={{ color: '#666', fontSize: '0.9rem', marginTop: '1rem' }}>
                      {listing.description.length > 100
                        ? `${listing.description.substring(0, 100)}...`
                        : listing.description}
                    </Card.Text>
                    <div className="d-flex gap-2 mt-3">
                      <Button
                        variant="danger"
                        onClick={() => navigate(`/edit-listing/${listing.id}`)}
                        style={{
                          backgroundColor: '#E63946',
                          borderColor: '#E63946',
                          borderRadius: '1.5rem',
                          flex: 1
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={() => handleDelete(listing.id)}
                        style={{ borderRadius: '1.5rem', flex: 1 }}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <div className="text-center mt-4">
          <Button
            onClick={() => navigate('/create-listing')}
            style={{
              backgroundColor: '#E63946',
              borderColor: '#E63946',
              color: 'white',
              fontWeight: 600,
              borderRadius: '2rem',
              padding: '0.7rem 2rem'
            }}
          >
            + Create New Listing
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default MyListings;
