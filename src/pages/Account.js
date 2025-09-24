import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Account = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    firstName: '',
    surname: '',
    phone: '',
    dob: '',
    password: '',
    confirmPassword: '',
  });

  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    Object.entries(form).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = 'This field is required';
      }
    });
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!form.email.includes('@')) {
      newErrors.email = 'Invalid email';
    }
    return newErrors;
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setForm((prev) => ({
          ...prev,
          email: firebaseUser.email || '',
          firstName: firebaseUser.displayName?.split(' ')[0] || '',
          surname: firebaseUser.displayName?.split(' ')[1] || '',
          phone: firebaseUser.phoneNumber || '',
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 1000);
  };

  return (
    <div className="page-section" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <Container>
<<<<<<< HEAD
        <h1 className="title-underline-2 text-left" style={{ color: '#E63946', fontWeight: 700, marginBottom: '2rem' }}>Your Remodify account</h1>
        <Form onSubmit={handleSubmit} className="mt-4" noValidate style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 12px rgba(230,57,70,0.07)', padding: '2rem' }}>
=======
        <h1 className="title-underline-2 text-left">Your Remodify account</h1>

        {user && (
          <div className="mb-4 d-flex align-items-center">
            <img
              src={user.photoURL}
              alt="Profile"
              style={{ width: 60, borderRadius: '50%', marginRight: 16 }}
            />
            <div>
              <div><strong>{user.displayName}</strong></div>
              <div className="text-muted">{user.email}</div>
            </div>
          </div>
        )}

        <Form onSubmit={handleSubmit} className="mt-4" noValidate>
>>>>>>> origin/main
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  isInvalid={!!errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  isInvalid={!!errors.firstName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.firstName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="surname">
                <Form.Label>Surname</Form.Label>
                <Form.Control
                  type="text"
                  name="surname"
                  value={form.surname}
                  onChange={handleChange}
                  required
                  isInvalid={!!errors.surname}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.surname}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="phone">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  isInvalid={!!errors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="dob">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  required
                  isInvalid={!!errors.dob}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.dob}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="password">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  isInvalid={!!errors.password}
                  placeholder="Enter new password"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  isInvalid={!!errors.confirmPassword}
                  placeholder="Re-enter new password"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
<<<<<<< HEAD
          <Button style={{ backgroundColor: '#E63946', borderColor: '#E63946', color: 'white', fontWeight: 600, borderRadius: '2rem', padding: '0.5rem 2rem' }} type="submit" disabled={saving} className="mt-2">
=======

          <Button
            style={{ backgroundColor: '#E63946', borderColor: '#E63946' }}
            type="submit"
            disabled={saving}
            className="mt-2"
          >
>>>>>>> origin/main
            {saving ? 'Saving...' : 'Save changes'}
          </Button>

          {success && <div className="text-success mt-3">Account details updated!</div>}
        </Form>
      </Container>
    </div>
  );
};

export default Account;