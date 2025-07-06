import React, { useState, useCallback } from 'react';
import { Container, Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { Typeahead } from 'react-bootstrap-typeahead';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';

const CreateListing = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [condition, setCondition] = useState('');
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false); // New state for modal
  const [negotiable, setNegotiable] = useState(false);
  const [showOtherManufacturerField, setShowOtherManufacturerField] = useState(false);
  const navigate = useNavigate();

  const carBrands = [
    "Abarth", "Alfa Romeo", "Alpine", "Aston Martin", "Audi", "Bentley", "BMW", "BYD",
    "Chery", "Chevrolet", "Chrysler", "Citroen", "Cupra", "Ferrari", "Fiat", "Ford",
    "Genesis", "GWM", "Haval", "Honda", "Hyundai", "Ineos", "Isuzu", "Jaecoo", "Jaguar",
    "Jeep", "Kia", "Lamborghini", "Land Rover", "LDV", "Lexus", "Lotus", "Mahindra",
    "Maserati", "Mazda", "McLaren", "Mercedes-Benz", "MG", "MINI", "Mitsubishi", "Nissan",
    "Peugeot", "Polestar", "Porsche", "RAM", "Renault", "Rolls-Royce", "Skoda", "Ssangyong",
    "Subaru", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo", "Zeekr", "Other"
  ];

  const onDrop = useCallback(acceptedFiles => {
    setFiles(acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const isFormValid = title && price && model && year && condition && files.length > 0 && description;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      // Handle form submission logic here
      console.log({ title, description, price, manufacturer, model, year, condition, files, negotiable });
      navigate('/SignupInformation');
    } else {
      setErrorMessage('*you must complete all mandatory boxes');
    }
  };

  const handleLoginClick = () => {
    if (isFormValid) {
      setShowLoginModal(true); // Show the modal
    } else {
      setErrorMessage('*you must complete all mandatory boxes');
    }
  };

  const handleCloseLoginModal = () => setShowLoginModal(false);

  const years = [];
  for (let i = 2026; i >= 1940; i--) {
    years.push(i);
  }

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
   try {
     await signInWithPopup(auth, provider);
      setShowLoginModal(false); // ✅ close modal on success
   } catch (error) {
      console.error('Google Sign-In Error:', error);
   }
  };

  return (
    <div className="page-section">
      <Container className="text-start">
        <h1 className="title-underline-1" style={{ fontSize: '24pt', textAlign: 'left', marginTop: '2rem' }}>Create a Listing</h1>
        <Row>
          <Col md={6}>
            <Form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
              <Form.Group controlId="formTitle" className="mb-3">
                <Form.Label>Title <span style={{ color: 'red' }}>*</span></Form.Label>
                <Form.Control type="text" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </Form.Group>

              <Form.Group controlId="formDescription" className="mb-3">
                <Form.Label>Description <span style={{ color: 'red' }}>*</span></Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} required />
              </Form.Group>

              <Form.Group controlId="formCondition" className="mb-3">
                <Form.Label>Condition <span style={{ color: 'red' }}>*</span></Form.Label>
                <Form.Select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  required
                  className={!condition ? 'placeholder-selected' : ''}
                >
                  <option value="" disabled hidden>Select Condition</option>
                  <option value="New">New</option>
                  <option value="Used - like new">Used - like new</option>
                  <option value="Used - good">Used - good</option>
                  <option value="Used - fair">Used - fair</option>
                  <option value="Used - worn">Used - worn</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="formPrice" className="mb-3">
                <Form.Label>Price <span style={{ color: 'red' }}>*</span></Form.Label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Form.Control type="text" placeholder="Enter price" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ flex: 1 }} />
                  <Form.Check
                    type="checkbox"
                    id="negotiable-checkbox"
                    label="Negotiable?"
                    checked={negotiable}
                    onChange={(e) => setNegotiable(e.target.checked)}
                  />
                </div>
              </Form.Group>

              <Button style={{ backgroundColor: 'rgb(198, 32, 32)', borderColor: 'rgb(198, 32, 32)', color: 'white', marginRight: '10px' }} type="submit">
                Continue to Sign-Up
              </Button>
              <Button style={{ backgroundColor: 'rgb(255, 102, 0)', borderColor: 'rgb(255, 102, 0)', color: 'white' }} type="button" onClick={handleLoginClick}>
                Log-in
              </Button>
              {errorMessage && <p style={{ color: 'grey', fontStyle: 'italic', marginTop: '10px' }}>{errorMessage}</p>}
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

      <div style={{ marginTop: '3rem' }}>
        <Container>
          <h2 style={{ fontSize: '1.7rem', textAlign: 'left', marginBottom: '1rem' }}>Additional information</h2>
          <div style={{ marginTop: '1rem', color: '#555', fontSize: '1rem', textAlign: 'left' }}>
            Help buyers find the right item, your product, by adding extra information.
          </div>
          <div style={{ marginBottom: '2rem', marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', textAlign: 'left', marginBottom: '1rem' }}>Suitable for</h3>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formYear">
                  <Form.Label>Year</Form.Label>
                  <Form.Select value={year} onChange={(e) => setYear(e.target.value)}>
                    <option value="">Select Year</option>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formManufacturer">
                  <Form.Label>Manufacturer</Form.Label>
                  <Typeahead
                    id="manufacturer-typeahead"
                    options={carBrands}
                    onChange={(selected) => {
                      if (selected.length > 0) {
                        if (selected[0] === 'Other') {
                          setShowOtherManufacturerField(true);
                          setManufacturer('');
                        } else {
                          setShowOtherManufacturerField(false);
                          setManufacturer(selected[0]);
                        }
                      } else {
                        setShowOtherManufacturerField(false);
                        setManufacturer('');
                      }
                    }}
                    onInputChange={(text) => {
                      setManufacturer(text);
                      if (text === 'Other') {
                        setShowOtherManufacturerField(true);
                      } else {
                        setShowOtherManufacturerField(false);
                      }
                    }}
                    selected={manufacturer ? [manufacturer] : []}
                    placeholder="Enter or select manufacturer"
                  />
                </Form.Group>
                {showOtherManufacturerField && (
                  <Form.Group controlId="formOtherManufacturer" className="mt-2">
                    <Form.Label>Specify Other Manufacturer</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter manufacturer name"
                      value={manufacturer}
                      onChange={(e) => setManufacturer(e.target.value)}
                    />
                  </Form.Group>
                )}
              </Col>
              <Col>
                <Form.Group controlId="formModel">
                  <Form.Label>Model</Form.Label>
                  <Form.Control type="text" placeholder="Enter model" value={model} onChange={(e) => setModel(e.target.value)} />
                </Form.Group>
              </Col>
            </Row>
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', textAlign: 'left', marginBottom: '1rem' }}>Part details</h3>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formPartBrand">
                  <Form.Label>Manufacturer/Brand</Form.Label>
                  <Form.Control type="text" placeholder="Enter manufacturer or brand" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formPartNumber">
                  <Form.Label>Part number</Form.Label>
                  <Form.Control type="text" placeholder="Enter part number" />
                </Form.Group>
              </Col>
            </Row>
          </div>
          {/* Add any extra fields, notes, or content here as needed */}
        </Container>
      </div>

      <Modal show={showLoginModal} onHide={handleCloseLoginModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Log in</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Button
            variant="primary"
            onClick={handleGoogleSignIn}
            style={{ backgroundColor: '#4285F4', borderColor: '#4285F4', color: 'white' }}
          >
            Log-in with Google
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CreateListing;
