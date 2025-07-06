import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from 'firebase/auth'
import { auth } from '../firebase.js'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
    // Add email/password auth here if desired
  };

  const handleGoogleSignIn = async () => {
    console.log("Google Button Clicked");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
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
      <Container className="text-start">
        <h1 className="title-underline-1" style={{ fontSize: '24pt' }}>Log into Remodify</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail" className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
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
           className="mt-3"
           onClick={handleGoogleSignIn}
          > 
           Sign in with Google
          </Button>
      </Container>
    </div>
  );
};

export default Login;
