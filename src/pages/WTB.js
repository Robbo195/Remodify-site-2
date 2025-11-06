import React, { useState, useEffect } from 'react';
import { Container, Form, Row, Col, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, getAuth } from 'firebase/auth';

const WTB = () => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [category, setCategory] = useState('');
  const [preferredCondition, setPreferredCondition] = useState('');

  // Part detail fields (from CreateListing)
  const [manufacturer, setManufacturer] = useState('');
  const [partNumber, setPartNumber] = useState('');

  const [user, setUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const categories = [
    'Engine', 'Suspension', 'Brakes', 'Electrical', 'Body', 'Interior', 'Transmission', 'Wheels & Tyres', 'Accessories', 'Performance', 'Cooling', 'Hydraulic', 'Custom Made', 'Other'
  ];

  const conditions = [
    'New', 'Used - like new', 'Used - good', 'Used - fair', 'Used - worn', 'Refurbished'
  ];

  // years removed (not used in WTB)

  const validate = () => {
    // Mandatory: minPrice, maxPrice, category, preferredCondition
    if (!minPrice || !maxPrice || !category || !preferredCondition) {
      setErrorMessage('Please complete all mandatory fields (min/max price, category, preferred condition).');
      return false;
    }
    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (isNaN(min) || isNaN(max) || min < 0 || max < 0 || min > max) {
      setErrorMessage('Please provide valid numeric min and max prices (min <= max).');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'wants'), {
        minPrice: Number(minPrice),
        maxPrice: Number(maxPrice),
        desiredCategory: category,
        preferredCondition,
        desiredManufacturer: manufacturer || null,
        desiredPartNumber: partNumber || null,
        userId: user ? user.uid : null,
        createdAt: serverTimestamp()
      });

  setSuccessMessage('WTB request submitted. We will notify you if matching listings are found.');
  // clear form (keep user logged in)
  setMinPrice(''); setMaxPrice(''); setCategory(''); setPreferredCondition('');
  setManufacturer(''); setPartNumber('');

      // optionally navigate to a confirmation or saved wants page
      setTimeout(() => {
        setSuccessMessage('');
        // stay on page for now
      }, 3500);
    } catch (err) {
      console.error('Error saving WTB request', err);
      setErrorMessage('There was an error saving your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-section" style={{ background: '#f8f9fa', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Container className="text-start">
        <h1 className="title-underline-1" style={{ fontSize: '2.2rem', textAlign: 'left', marginTop: '2rem', color: '#E63946', fontWeight: 700 }}>WTB (Want To Buy)</h1>
        <p className="lead">Are you chasing a specific item? Post a WTB and let sellers see your request once they have listed an item. If it's a close match, they can notify you directly so you don't miss out!</p>

        <Form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #e9e9e9', padding: '1.25rem', borderRadius: '0.75rem' }}>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <Row>
          <Col md={6}>
            <Form.Group controlId="wtbMinPrice" className="mb-3">
              <Form.Label>Min Price <span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control type="number" min={0} value={minPrice} onChange={e => setMinPrice(e.target.value)} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="wtbMaxPrice" className="mb-3">
              <Form.Label>Max Price <span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control type="number" min={0} value={maxPrice} onChange={e => setMaxPrice(e.target.value)} required />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="wtbCategory" className="mb-3">
              <Form.Label>Category <span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Select value={category} onChange={e => setCategory(e.target.value)} required>
                <option value="">Select category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="wtbCondition" className="mb-3">
              <Form.Label>Preferred condition <span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Select value={preferredCondition} onChange={e => setPreferredCondition(e.target.value)} required>
                <option value="">Select condition</option>
                {conditions.map(c => <option key={c} value={c}>{c}</option>)}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <hr />

        <h4 style={{ color: '#E63946', marginTop: '1rem' }}>Part details (optional)</h4>
        <Row>
          <Col md={6}>
            <Form.Group controlId="wtbManufacturer" className="mb-3">
              <Form.Label>Manufacturer / Brand</Form.Label>
              <Form.Control type="text" value={manufacturer} onChange={e => setManufacturer(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="wtbPartNumber" className="mb-3">
              <Form.Label>Part number</Form.Label>
              <Form.Control type="text" value={partNumber} onChange={e => setPartNumber(e.target.value)} />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" disabled={submitting} className="btn-primary" style={{ backgroundColor: '#E63946', borderColor: '#E63946' }}>{submitting ? 'Submitting...' : 'Submit WTB'}</Button>
        </div>
        </Form>
      </Container>
    </div>
  );
};

export default WTB;
