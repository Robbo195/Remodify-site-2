import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const EditListing = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [price, setPrice] = useState('');
  const [negotiable, setNegotiable] = useState(false);
  const [description, setDescription] = useState('');
  const [originalListing, setOriginalListing] = useState(null);

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
    const fetchListing = async () => {
      if (!user || !listingId) return;

      try {
        setLoading(true);
        const listingRef = doc(db, 'listings', listingId);
        const listingSnap = await getDoc(listingRef);

        if (listingSnap.exists()) {
          const data = listingSnap.data();
          
          // Check if the user owns this listing
          if (data.userId !== user.uid) {
            setError('You do not have permission to edit this listing.');
            return;
          }

          setOriginalListing(data);
          setPrice(data.price || '');
          setNegotiable(data.negotiable || false);
          setDescription(data.description || '');
        } else {
          setError('Listing not found.');
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError('Failed to load listing.');
      } finally {
        setLoading(false);
      }
    };

    if (user && listingId) {
      fetchListing();
    }
  }, [user, listingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!price || !description) {
      setError('Price and description are required.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const listingRef = doc(db, 'listings', listingId);
      await updateDoc(listingRef, {
        price: Number(price),
        negotiable,
        description
      });

      navigate('/my-listings');
    } catch (err) {
      console.error('Error updating listing:', err);
      setError('Failed to update listing. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center" style={{ minHeight: '60vh', paddingTop: '5rem' }}>
        <Spinner animation="border" variant="danger" />
        <p className="mt-3">Loading listing...</p>
      </Container>
    );
  }

  if (error && !originalListing) {
    return (
      <Container style={{ minHeight: '60vh', paddingTop: '5rem' }}>
        <div className="alert alert-danger">{error}</div>
        <Button onClick={() => navigate('/my-listings')} variant="secondary">
          Back to My Listings
        </Button>
      </Container>
    );
  }

  return (
    <div className="page-section" style={{ background: '#f8f9fa', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '3rem' }}>
      <Container>
        <div style={{ maxWidth: '800px' }}>
          <h1 className="title-underline-2 text-left" style={{ color: '#E63946', fontWeight: 700, marginBottom: '2rem' }}>
            Edit Listing
          </h1>

          {originalListing && (
            <div className="mb-4 p-3 rounded" style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h5 style={{ color: '#E63946', fontWeight: 600 }}>{originalListing.title}</h5>
              <p className="text-muted mb-0">
                {originalListing.manufacturer} {originalListing.model} {originalListing.year && `(${originalListing.year})`}
              </p>
            </div>
          )}

          <Form onSubmit={handleSubmit} style={{ background: '#fff', padding: '2rem', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          {error && <div className="alert alert-danger">{error}</div>}

          <Form.Group className="mb-4" controlId="formPrice">
            <Form.Label style={{ fontWeight: 600 }}>
              Price <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <div className="d-flex align-items-center">
              <span style={{ marginRight: '0.5rem', fontSize: '1.2rem' }}>$</span>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                step="0.01"
                min="0"
                style={{ flex: 1 }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-4" controlId="formNegotiable">
            <Form.Check
              type="checkbox"
              label="Negotiable?"
              checked={negotiable}
              onChange={(e) => setNegotiable(e.target.checked)}
              style={{ fontWeight: 600 }}
            />
            <Form.Text className="text-muted">
              Allow buyers to make offers on this item
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-4" controlId="formDescription">
            <Form.Label style={{ fontWeight: 600 }}>
              Description <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Describe the item, its condition, any defects, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <div className="d-flex gap-3">
            <Button
              type="submit"
              disabled={saving}
              style={{
                backgroundColor: '#E63946',
                borderColor: '#E63946',
                color: 'white',
                fontWeight: 600,
                borderRadius: '2rem',
                padding: '0.7rem 2rem'
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => navigate('/my-listings')}
              style={{
                borderRadius: '2rem',
                padding: '0.7rem 2rem',
                fontWeight: 600
              }}
            >
              Cancel
            </Button>
          </div>
        </Form>
        </div>
      </Container>
    </div>
  );
};

export default EditListing;
