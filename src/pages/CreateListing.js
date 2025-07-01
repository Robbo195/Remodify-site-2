import React, { useState, useCallback } from 'react';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';

const CreateListing = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [condition, setCondition] = useState('');
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const onDrop = useCallback(acceptedFiles => {
    setFiles(acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const isFormValid = title && price && manufacturer && model && year && condition && files.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      // Handle form submission logic here
      console.log({ title, description, price, manufacturer, model, year, condition, files });
      navigate('/SellersAddress');
    }
  };

  const years = [];
  for (let i = 1940; i <= 2026; i++) {
    years.push(i);
  }

  return (
    <div className="page-section">
      <Container className="text-start">
        <h1 className="title-underline-1" style={{ fontSize: '24pt' }}>Create a Listing</h1>
        <Row>
          <Col md={6}>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formTitle" className="mb-3">
                <Form.Label>Title <span style={{ color: 'red' }}>*</span></Form.Label>
                <Form.Control type="text" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </Form.Group>

              <Form.Group controlId="formDescription" className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} />
              </Form.Group>

              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="formManufacturer">
                    <Form.Label>Manufacturer <span style={{ color: 'red' }}>*</span></Form.Label>
                    <Form.Control type="text" placeholder="Enter manufacturer" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} required />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formModel">
                    <Form.Label>Model <span style={{ color: 'red' }}>*</span></Form.Label>
                    <Form.Control type="text" placeholder="Enter model" value={model} onChange={(e) => setModel(e.target.value)} required />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="formYear">
                    <Form.Label>Year <span style={{ color: 'red' }}>*</span></Form.Label>
                    <Form.Select value={year} onChange={(e) => setYear(e.target.value)} required>
                      <option value="">Select Year</option>
                      {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formCondition">
                    <Form.Label>Condition</Form.Label>
                    <Form.Control type="text" placeholder="Enter condition" value={condition} onChange={(e) => setCondition(e.target.value)} required />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="formPrice" className="mb-3">
                <Form.Label>Price <span style={{ color: 'red' }}>*</span></Form.Label>
                <Form.Control type="text" placeholder="Enter price" value={price} onChange={(e) => setPrice(e.target.value)} required />
              </Form.Group>

              <Button style={{ backgroundColor: 'rgb(198, 32, 32)', borderColor: 'rgb(198, 32, 32)', color: 'white' }} type="submit" disabled={!isFormValid}>
                Continue to Address
              </Button>
            </Form>
          </Col>
          <Col md={6}>
            <div {...getRootProps()} style={{
              border: '2px dashed #ddd',
              padding: '15px',
              minHeight: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isDragActive ? '#e8e8e8' : '#f9f9f9',
              textAlign: 'center',
              cursor: 'pointer'
            }}>
              <input {...getInputProps()} />
              {
                files.length > 0 ? (
                  <div>
                    {files.map(file => (
                      <img src={file.preview} key={file.path} alt={file.path} style={{ maxWidth: '100%', maxHeight: '280px' }} />
                    ))}
                  </div>
                ) : (
                  <p>Drag and drop your photos here or click to select files. <span style={{ color: 'red' }}>*</span></p>
                )
              }
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CreateListing;
