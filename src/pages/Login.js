import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  onAuthStateChanged,
  signOut
} from 'firebase/auth'
import { auth } from '../firebase.js'
import { useLocation, useNavigate } from 'react-router-dom';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Accept either email or username
    const isEmail = identifier.includes('@');
    if (isEmail) {
      // Use email for authentication (email/password or provider)
      // Add email/password auth here if desired
      console.log({ email: identifier, password });
    } else {
      // Username: in a real app, lookup email by username from your user DB
      // For now, just log for demonstration
      console.log({ username: identifier, password });
      // You would fetch the email for this username, then proceed with email/password auth
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };

  const handleFacebookSignIn = async () => {
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Facebook Sign-In Error:', error);
    }
  };

  // Handle Sign-Out
  const handleLogout = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
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
              <Form.Label>Email Address or Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter email or username"
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
              <a href="#" style={{ color: '#E63946', fontWeight: 500, textDecoration: 'underline', fontSize: '1rem' }}>Forgot password?</a>
            </div>
            <Button style={{ backgroundColor: '#E63946', borderColor: '#E63946', color: 'white', fontWeight: 600, borderRadius: '2rem', padding: '0.5rem 2rem', fontSize: '1.1rem', width: '100%' }} type="submit">
              Log in
            </Button>
          </Form>
          <div style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1rem', color: '#222' }}>
              Not a member?{' '}
              <a href="/SellersAddress" style={{ color: '#E63946', fontWeight: 600, textDecoration: 'underline' }}>Sign up!</a>
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
