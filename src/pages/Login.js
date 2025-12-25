import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import { auth } from '../firebase.js'
import { useLocation, useNavigate } from 'react-router-dom';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // user state is not used directly; remove to avoid linter warning
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!identifier.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, identifier, password);
      // Navigation will be handled by onAuthStateChanged
    } catch (error) {
      console.error('Email/Password Sign-In Error:', error);
      setError('Please use the same provider you signed up with.');
    }
  };

  const handleSignUp = async () => {
    if (!identifier.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!password) {
      alert('Please enter a password.');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, identifier, password);
      navigate('/signupinformation');
    } catch (error) {
      console.error('Email/Password Sign-Up Error:', error);
      alert('Error creating account. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/signupinformation');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };

  const handleFacebookSignIn = async () => {
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/signupinformation');
    } catch (error) {
      console.error('Facebook Sign-In Error:', error);
    }
  };

  // Sign-out handler not required on this page; handled elsewhere

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Check for redirect param in location.state or query string
        let redirectTo = null;
        if (location.state && location.state.redirectTo) {
          redirectTo = location.state.redirectTo;
        } else {
          const params = new URLSearchParams(location.search);
          redirectTo = params.get('redirect');
        }
        if (redirectTo) {
          navigate(redirectTo, { replace: true });
        }
      }
    });
    return () => unsubscribe();
  }, [location, navigate]);

  return (
    <div className="page-section" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <Container>
        <div style={{ maxWidth: 480, margin: '0 auto', background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 12px rgba(230,57,70,0.07)', padding: '2.5rem 2rem', marginTop: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <img src={require('../assets/logo.png')} alt="Remodify Logo" height="48" style={{ borderRadius: '0.5rem', boxShadow: '0 2px 8px rgba(230,57,70,0.10)' }} />
          </div>
          <Form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
            <Form.Group controlId="formBasicIdentifier" className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{ borderRadius: '2rem', padding: '0.75rem 1.2rem', fontSize: '1.1rem' }}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ borderRadius: '2rem', padding: '0.75rem 1.2rem', fontSize: '1.1rem' }} />
            </Form.Group>
            <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
              <button type="button" onClick={() => navigate('/forgot-password')} style={{ background: 'none', border: 'none', color: '#E63946', fontWeight: 500, textDecoration: 'underline', fontSize: '1rem', padding: 0, cursor: 'pointer' }}>Forgot password?</button>
            </div>
            <Row>
              <Col md={6}>
                <Button style={{ backgroundColor: '#E63946', borderColor: '#E63946', color: 'white', fontWeight: 600, borderRadius: '2rem', padding: '0.5rem 2rem', fontSize: '1.1rem', width: '100%' }} type="submit">
                  Log in
                </Button>
              </Col>
              <Col md={6}>
                <Button style={{ backgroundColor: '#7b91c7ff', borderColor: '#ab9be4ff', color: 'white', fontWeight: 600, borderRadius: '2rem', padding: '0.5rem 2rem', fontSize: '1.1rem', width: '100%' }} type="button" onClick={handleSignUp}>
                  Sign up
                </Button>
              </Col>
            </Row>
          </Form>
          {error && <div style={{ color: 'red', fontStyle: 'italic', textAlign: 'center', marginTop: '1rem' }}>{error}</div>}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1rem', color: '#222' }}>
              In a rush?{' '}
              <span style={{ color: '#E63946', fontWeight: 600 }}>Sign in with our providers below</span>
            </span>
          </div>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 gap-2">
            <Button
              variant="outline-dark"
              style={{ borderRadius: '2rem', padding: '0.5rem 2rem', fontWeight: 600, width: '100%' }}
              onClick={handleGoogleSignIn}
            >
              Sign in with Google
            </Button>
            <Button
              variant="outline-primary"
              style={{ borderRadius: '2rem', padding: '0.5rem 2rem', fontWeight: 600, width: '100%' }}
              onClick={handleFacebookSignIn}
            >
              Sign in with Facebook
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;
