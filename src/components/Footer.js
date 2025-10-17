import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  const linkStyle = {
    color: '#222',
    fontSize: '0.95rem',
    fontWeight: 500,
    textDecoration: 'none',
    padding: '6px 10px',
    borderRadius: '6px'
  };

  return (
    <footer aria-label="site-footer" style={{ background: '#fff', borderTop: '2px solid #E63946', boxShadow: '0 -2px 12px rgba(230,57,70,0.07)', padding: '10px 0' }}>
      <Container className="d-flex justify-content-center align-items-center" style={{ gap: '1.2rem' }}>
        <Link to="/terms" style={linkStyle} onMouseOver={e => e.currentTarget.style.color = '#E63946'} onMouseOut={e => e.currentTarget.style.color = '#222'}>T's & C's</Link>
        <Link to="/returns" style={linkStyle} onMouseOver={e => e.currentTarget.style.color = '#E63946'} onMouseOut={e => e.currentTarget.style.color = '#222'}>Returns</Link>
        <Link to="/privacy" style={linkStyle} onMouseOver={e => e.currentTarget.style.color = '#E63946'} onMouseOut={e => e.currentTarget.style.color = '#222'}>Privacy Policy</Link>
      </Container>
    </footer>
  );
};

export default Footer;
