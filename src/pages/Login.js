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

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

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
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="page-section">
      <Container>
        <h1 className="title-underline-2" style={{ textAlign: 'left', marginTop: '2rem' }}>Sign in to Remodify</h1>
        <Form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <Form.Group controlId="formBasicIdentifier" className="mb-3">
            <Form.Label>Email Address or Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter email or username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>
          <Button style={{ backgroundColor: 'rgb(198, 32, 32)', borderColor: 'rgb(198, 32, 32)', color: 'white' }} type="submit">
            Log-in
          </Button>
        </Form>
        <Button
          variant="outline-dark"
          className="mt-3 me-2"
          onClick={handleGoogleSignIn}
        >
          Sign in with Google
        </Button>
        <Button
          variant="outline-primary"
          className="mt-3"
          onClick={handleFacebookSignIn}
        >
          Sign in with Facebook
        </Button>
      </Container>
    </div>
  );
};

export default Login;
