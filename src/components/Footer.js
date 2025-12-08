import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import australiaFlag from '../assets/australia-flag.png';

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
      <Container className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center" style={{ gap: 8 }}>
          <span style={{ color: '#333', fontSize: '0.95rem', fontWeight: 600 }}>Unapologetically Australian</span>
          <img src={australiaFlag} alt="Flag of Australia" style={{ width: 28, height: 'auto', borderRadius: 3, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/terms" style={linkStyle} onMouseOver={e => e.currentTarget.style.color = '#E63946'} onMouseOut={e => e.currentTarget.style.color = '#222'}>T's & C's</Link>
          <Link to="/returns" style={linkStyle} onMouseOver={e => e.currentTarget.style.color = '#E63946'} onMouseOut={e => e.currentTarget.style.color = '#222'}>Returns</Link>
          <Link to="/privacy" style={linkStyle} onMouseOver={e => e.currentTarget.style.color = '#E63946'} onMouseOut={e => e.currentTarget.style.color = '#222'}>Privacy Policy</Link>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
