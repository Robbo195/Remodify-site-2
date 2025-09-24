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
import ListingSuccess from './pages/ListingSuccess';
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
          <Navbar bg="white" expand="lg" sticky="top" style={{ boxShadow: '0 2px 12px rgba(230,57,70,0.07)', borderBottom: '2px solid #E63946', minHeight: '70px' }}>
            <Container>
              <Navbar.Brand as={Link} to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Image src={logo} alt="Remodify Logo" height="38" className="d-inline-block align-top" style={{ borderRadius: '0.5rem', boxShadow: '0 2px 8px rgba(230,57,70,0.10)' }} />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto" style={{ color: 'black', fontWeight: 500, fontSize: '1.1rem' }}>
                  {/* <Nav.Link href="/" style={{ color: 'black' }}>Home</Nav.Link> */}
                  <Nav.Link href="/about" style={{ color: '#222', marginRight: '1.5rem' }}>About</Nav.Link>
                  <Nav.Link href="/services" style={{ color: '#222', marginRight: '1.5rem' }}>Services</Nav.Link>
                  <Nav.Link href="/contact" style={{ color: '#222', marginRight: '1.5rem' }}>Contact</Nav.Link>
                </Nav>
                <Nav>
                  <div className="d-flex align-items-center" style={{ gap: '1.2rem' }}>
                    <Nav.Link href="/create-listing" className="ms-2" style={{ color: '#E63946', fontWeight: 700, fontSize: '1.1rem', border: '2px solid #E63946', borderRadius: '2rem', padding: '0.3rem 1.2rem', background: 'white', transition: 'background 0.2s, color 0.2s' }}
                      onMouseOver={e => { e.target.style.background = '#E63946'; e.target.style.color = 'white'; }}
                      onMouseOut={e => { e.target.style.background = 'white'; e.target.style.color = '#E63946'; }}
                    >Sell your part</Nav.Link>
                    {user ? (
                      <div style={{ marginLeft: '2.5rem' }}><ProfileIcon /></div>
                    ) : (
                      <Nav.Link href="/login" className="btn ms-2" style={{ backgroundColor: '#FF6600', color: 'white', fontWeight: 600, borderRadius: '2rem', padding: '0.5rem 2rem', fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(230,57,70,0.10)' }}>Sign up/Log in</Nav.Link>
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
          <Route path="/listing-success" element={<ListingSuccess />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
