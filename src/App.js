
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Container, Nav, Navbar, Image } from 'react-bootstrap';
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

function App() {
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
                <Nav className="me-auto">
                  <Nav.Link href="/">Home</Nav.Link>
                  <Nav.Link href="/about">About</Nav.Link>
                  <Nav.Link href="/services">Services</Nav.Link>
                  <Nav.Link href="/contact">Contact</Nav.Link>
                </Nav>
                <Nav>
                  <div className="d-flex align-items-center">
                    <span className="me-2">Create a listing</span>
                    <Nav.Link href="/create-listing" className="btn" style={{ backgroundColor: 'rgb(93, 93, 93)', color: 'white', padding: '0.375rem 2.25rem' }}>+</Nav.Link>
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
