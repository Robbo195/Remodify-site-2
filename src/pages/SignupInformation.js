import React, { useState } from 'react';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';

const SignupInformation = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [postcode, setPostcode] = useState('');
  const [companyName, setCompanyName] = useState('');

  const isFormValid = firstName && lastName && address && email && phoneNumber && postcode;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      // Handle form submission logic here
      console.log({ firstName, lastName, address, email, phoneNumber, postcode, companyName });
    }
  };

  return (
    <div className="page-section">
      <Container className="text-start">
        <h1 className="title-underline-1" style={{ fontSize: '24pt' }}>Sign up to Remodify</h1>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formFirstName">
                <Form.Label>First Name <span style={{ color: 'red' }}>*</span></Form.Label>
                <Form.Control type="text" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formLastName">
                <Form.Label>Last Name <span style={{ color: 'red' }}>*</span></Form.Label>
                <Form.Control type="text" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="formAddress" className="mb-3">
            <Form.Label>Address <span style={{ color: 'red' }}>*</span></Form.Label>
            <Form.Control type="text" placeholder="Enter address" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </Form.Group>

          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formPhoneNumber">
                <Form.Label>Phone Number <span style={{ color: 'red' }}>*</span></Form.Label>
                <Form.Control type="tel" placeholder="Enter phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formPostcode">
                <Form.Label>Postcode <span style={{ color: 'red' }}>*</span></Form.Label>
                <Form.Control type="text" placeholder="Enter postcode" value={postcode} onChange={(e) => setPostcode(e.target.value)} required />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email Address <span style={{ color: 'red' }}>*</span></Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>

          <Form.Group controlId="formCompanyName" className="mb-3">
            <Form.Label>Company Name</Form.Label>
            <Form.Control type="text" placeholder="Enter company name (optional)" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </Form.Group>

          <Button style={{ backgroundColor: 'rgb(198, 32, 32)', borderColor: 'rgb(198, 32, 32)', color: 'white' }} type="submit" disabled={!isFormValid}>
            Submit Listing
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default SignupInformation;
