import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';

const Checkout = () => {
  return (
    <div className='page-section padding-top-50'>
      <Container>
     <div style={{ paddingTop: '50px'}}>
        <h1 style={{ textAlign: 'left', color: 'rgb(198, 32, 32)' }}>Ready to Remodify?</h1>
          <div style ={{ textAlign: 'left'}}>
              Based on your shipping address, Remodify has approximated the shipping cost as "..."
          </div>
      </div>
      </Container>
    </div>
  );
};

export default Checkout;