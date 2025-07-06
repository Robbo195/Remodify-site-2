import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Container, Nav, Navbar, Image } from 'react-bootstrap';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import logo from './assets/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Landing from './pages/Landing';
import Results from './pages/Results';
import CreateListing from './pages/CreateListing';
import SignupInformation from './pages/SignupInformation';
import Login from './pages/Login';
import Account from './pages/Account';
import ProfileIcon from './components/ProfileIcon';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="App">
        <div className="App-header">
          <Navbar bg="light" expand="lg" sticky="top">
            <Container>
              <Navbar.Brand as={Link} to="/">
                <Image src={logo} alt="Remodify Logo" height="30" className="d-inline-block align-top" />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto" style={{ color: 'black' }}>
                  <Nav.Link href="/" style={{ color: 'black' }}>Home</Nav.Link>
                  <Nav.Link href="/about" style={{ color: 'black' }}>About</Nav.Link>
                  <Nav.Link href="/services" style={{ color: 'black' }}>Services</Nav.Link>
                  <Nav.Link href="/contact" style={{ color: 'black' }}>Contact</Nav.Link>
                </Nav>
                <Nav>
                  <div className="d-flex align-items-center" style={{ gap: '0.5rem' }}>
                    <span className="me-2" style={{ color: 'black' }}>Sell your part</span>
                    <Nav.Link href="/create-listing" className="btn" style={{ backgroundColor: 'rgb(93, 93, 93)', color: 'white', padding: '0.375rem 2.25rem' }}>+</Nav.Link>
                    {user ? (
                      <div style={{ marginLeft: '2.5rem' }}><ProfileIcon /></div>
                    ) : (
                      <Nav.Link href="/login" className="btn btn-primary ms-2">Sign in</Nav.Link>
                    )}
                  </div>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div>

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/results" element={<Results />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/SellersAddress" element={<SignupInformation />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
