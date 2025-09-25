import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    if (data.success) {
      alert('Message sent!');
      setFormData({ name: '', email: '', message: '' });
    } else {
      alert('Error sending message.');
    }
  };

  return (
    <div className="page-section" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <Container>
        <h1 className="title-underline-2" style={{ textAlign: 'left', marginTop: '2rem', color: '#E63946', fontWeight: 700 }}>Contact Us</h1>
        <Form onSubmit={handleSubmit} style={{ textAlign: 'left', background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 12px rgba(230,57,70,0.07)', padding: '2rem' }}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Message</Form.Label>
            <Form.Control as="textarea" rows={3} name="message" value={formData.message} onChange={handleChange} required />
          </Form.Group>
          <Button variant="primary" type="submit" style={{ backgroundColor: '#E63946', borderColor: '#E63946', fontWeight: 600, borderRadius: '2rem', padding: '0.5rem 2rem' }}>
            Submit
          </Button>
        </Form>
      </Container>
      <div className="team-section" style={{ marginTop: '3rem', textAlign: 'left' }}>
        <Container>
          <h2 className="title-underline-2" style={{ textAlign: 'left', fontSize: '2.5rem', color: '#E63946', fontWeight: 700 }}>Meet the Team</h2>
          <p>
            G'day and Welcome to Remodify!<br /><br />
            Thanks for taking a look around. We hope we have been useful to you in finding what you need.<br /><br />
            We're Robert and Mark - two uni students studying medicine and commerce full time, while working part time. Sometimes, as with all of us, life gets a bit hectic. This being so, we mightn't be able to get back to you as fast as some other websites may. Nevertheless, we will endeavour to get back to you as soon as possible.<br /><br />
            We would love for you to leave feedback - any feedback whether positive or negative is constructive to us.<br /><br />
            We look forward to hearing from you. Happy Remodifying!<br /><br />
            Mark and Rob.
          </p>
        </Container>
      </div>
    </div>
  );
};

export default Contact;
