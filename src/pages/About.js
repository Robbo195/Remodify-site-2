import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import australiaMap from '../assets/australia_map.png';

const About = () => {
  return (
    <div className="page-section" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <Container>
        <h1 className="title-underline-2 text-left" style={{ color: '#E63946', fontWeight: 700, marginBottom: '2rem' }}>About Us</h1>
        <Row className="align-items-center">
          <Col md={8}>
            <div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 12px rgba(230,57,70,0.07)', padding: '2rem' }}>
              <p className="text-left">
              Welcome to ModRex! <br /><br />
              Born from a passion for motoring and a vision to connect car enthusiasts across Australia, ModRex is your go-to marketplace for buying and selling automotive parts.<br /><br />
              Whether you're looking to source rare components for your restoration project or find a new home for parts you no longer need, ModRex is here to facilitate seamless, secure transactions for all motoring enthusiasts.<br /><br />
              
              </p>
            </div>
          </Col>
          <Col md={4}>
            <img src={australiaMap} alt="Map of Australia" className="img-fluid rounded shadow-sm" style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 12px rgba(230,57,70,0.07)' }} />
          </Col>
        </Row>

        {/* Our Core Values Section */}
        <Row className="mt-5">
          <Col md={{ span: 10, offset: 1 }}>
            <div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 12px rgba(230,57,70,0.07)', padding: '2rem' }}>
              <h2 style={{ color: '#E63946', fontWeight: 700, marginBottom: '1.5rem' }}>Our Core Values</h2>
              <ol style={{ fontSize: '1.1rem', color: '#333', paddingLeft: 0, marginLeft: 0, textAlign: 'left' }}>
                <li style={{ marginBottom: '1rem' }}><strong>Community:</strong> We believe in breaking down location barriers to make parts accessible to all motoring enthusiasts across Australia.</li>
                <li style={{ marginBottom: '1rem' }}><strong>Trust & Safety:</strong> We prioritise secure transactions and reliable shipping, so you can buy and sell with confidence.</li>
                <li style={{ marginBottom: '1rem' }}><strong>Passion:</strong> We are car lovers at heart, dedicated to helping you achieve your vision, no matter how unique your project.</li>
                <li style={{ marginBottom: '1rem' }}><strong>Transparency:</strong> Clear communication and honest listings are at the core of every transaction on ModRex.</li>
              </ol>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;