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
                When you’re building your building your pride and joy, you want the best quality parts at the most attainable prices. In many cases, you just about have to sell a kidney just to get your hands on the shell. And this is before you even think about modifying it. 
              </p>
              <p className="text-left">
                And what about if you buy the wrong part? You’ve scoured every corner of the internet just to be sent the wrong part and find out there’s no refunds. 
              </p>
              <p className="text-left">
                As car enthusiasts, we understand that building your dream rig is no easy feat. We also believe that you shouldn’t have to settle for being ripped off.
              </p>
              <p className="text-left">
                At ModRex, we value ALL motoring enthusiasts. No matter what your project – a car, bike, buggy or even a racing lawn mower, we are here to help you make your dream vehicle a reality and do it without breaking the bank. 
              </p>
              <p className="text-left">
                ModRex connects enthusiasts to get the best parts, at the best prices. Why buy brand new when you can buy virtually new at a fraction of the price? And forget about being limited to the parts in your local area. Being from a regional city, we get it. ModRex will connect you with people all over the globe and make shipping and transactions safer and easier than ever.
              </p>
              <p className="text-left">
                Got a part to sell? Want to buy a part? ModRex is your one-stop solution.
              </p>
              <p className="text-left">
                So, what are you waiting for? 
              </p>
              <p className="text-left">
                Happy modifying with ModRex!
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
                <li style={{ marginBottom: '1rem' }}><strong>Community:</strong> We believe in unifying all motoring enthusiasts from across Australia into one homogenous community.</li>
                <li style={{ marginBottom: '1rem' }}><strong>Affordability:</strong> Making dream builds accessible by providing quality parts at fair prices, helping you save without compromise.</li>
                <li style={{ marginBottom: '1rem' }}><strong>Trust & Safety:</strong> We prioritise secure transactions and reliable shipping, so you can buy and sell with confidence.</li>
                <li style={{ marginBottom: '1rem' }}><strong>Passion:</strong> We are car lovers at heart, dedicated to helping you achieve your vision, no matter how unique your project.</li>
                <li style={{ marginBottom: '1rem' }}><strong>Transparency:</strong> Clear communication and honest listings are at the core of every transaction on Remodify.</li>
              </ol>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;