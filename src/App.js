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

import Contact from './pages/Contact';
import Landing from './pages/Landing';
import Results from './pages/Results';
import CreateListing from './pages/CreateListing';
import SignupInformation from './pages/SignupInformation';
import Login from './pages/Login';
import Account from './pages/Account';
import ListingSuccess from './pages/ListingSuccess';
import ProfileIcon from './components/ProfileIcon';
import Footer from './components/Footer';
import trolleyIcon from './assets/trolley.svg';
import Terms from './pages/Terms';
import Returns from './pages/Returns';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Services2 from './pages/services2';
import SavedListings from './pages/SavedListings';
import Checkout from './pages/checkout';
import DeliveryPaymentDetails from './pages/DeliveryDetails';

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen for cart changes from Results page
  useEffect(() => {
    // Listen for custom event from Results page
    const handleCartUpdate = (e) => {
      setCartCount(e.detail.count);
    };
    window.addEventListener('remodify-cart-update', handleCartUpdate);
    return () => window.removeEventListener('remodify-cart-update', handleCartUpdate);
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
                  <Nav.Link as={Link} to="/services2" style={{ color: '#222', marginRight: '1.5rem' }}>Services</Nav.Link>
                  <Nav.Link as={Link} to="/about" style={{ color: '#222', marginRight: '1.5rem' }}>About</Nav.Link>
                  <Nav.Link as={Link} to="/contact" style={{ color: '#222', marginRight: '1.5rem' }}>Contact</Nav.Link>
                  {/* Removed Saved Listings button from banner as it is now in the account dropdown */}
                </Nav>
                <Nav>
                  <div className="d-flex align-items-center" style={{ gap: '1.2rem' }}>
                    <Nav.Link
                      as={Link}
                      to="/checkout"
                      className="d-flex align-items-center ms-2"
                      style={{ background: 'none', border: 'none', boxShadow: 'none', padding: '0.3rem 0.8rem', position: 'relative' }}
                      title="Go to checkout"
                    >
                      <span style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                        <img src={trolleyIcon} alt="Trolley" style={{ width: 26, height: 26, marginRight: 6, filter: 'drop-shadow(0 1px 2px rgba(230,57,70,0.10))' }} />
                        <span className="d-none d-md-inline" style={{ color: '#E63946', fontWeight: 600, fontSize: '1.05rem', marginLeft: 6 }}>Trolley</span>
                        {cartCount > 0 && (
                          <span style={{
                            position: 'absolute',
                            top: -6,
                            right: -10,
                            background: '#FF6600',
                            color: 'white',
                            borderRadius: '50%',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            minWidth: 22,
                            height: 22,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(230,57,70,0.10)'
                          }}>{cartCount}</span>
                        )}
                      </span>
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/create-listing"
                      className="ms-2"
                      style={{ color: '#E63946', fontWeight: 700, fontSize: '1.1rem', border: '2px solid #E63946', borderRadius: '2rem', padding: '0.3rem 1.2rem', background: 'white', transition: 'background 0.2s, color 0.2s' }}
                      onMouseOver={e => { e.target.style.background = '#E63946'; e.target.style.color = 'white'; }}
                      onMouseOut={e => { e.target.style.background = 'white'; e.target.style.color = '#E63946'; }}
                    >Sell your part</Nav.Link>
                    {authLoading ? null : user ? (
                      <div style={{ marginLeft: '2.5rem' }}><ProfileIcon /></div>
                    ) : (
                      <Nav.Link as={Link} to="/login" className="btn ms-2" style={{ backgroundColor: '#FF6600', color: 'white', fontWeight: 600, borderRadius: '2rem', padding: '0.5rem 2rem', fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(230,57,70,0.10)' }}>Sign up/Log in</Nav.Link>
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
          <Route path="/contact" element={<Contact />} />
          <Route path="/results" element={<Results />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/SellersAddress" element={<SignupInformation />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/listing-success" element={<ListingSuccess />} />
          <Route path="/services2" element={<Services2 />} />
          <Route path="/saved-listings" element={<SavedListings />} />
          <Route path="/delivery-details" element={<DeliveryPaymentDetails />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;