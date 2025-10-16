import React, { useState, useCallback, useEffect } from 'react';
import { Container, Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Typeahead } from 'react-bootstrap-typeahead';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';

import { db } from '../firebase'; 
import {collection, addDoc, serverTimestamp } from 'firebase/firestore'

import { onAuthStateChanged } from 'firebase/auth';

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
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false); // Collapsible section state
  const navigate = useNavigate();

  const carBrands = [
    "Abarth", "Alfa Romeo", "Alpine", "Aston Martin", "Audi", "Bentley", "BMW", "BYD",
    "Chery", "Chevrolet", "Chrysler", "Citroen", "Cupra", "Ferrari", "Fiat", "Ford",
    "Genesis", "GWM", "Haval", "Holden" ,"Honda", "Hyundai", "Ineos", "Isuzu", "Jaecoo", "Jaguar",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setErrorMessage('*you must complete all mandatory boxes');
      return;
    }

    try {
      // For now, placeholder image (you'll later use Firebase Storage)
      const imageUrl = "https://via.placeholder.com/400x250";

      const docRef = await addDoc(collection(db, "listings"), {
        title,
        description,
        price: Number(price),
        manufacturer,
        model,
        year,
        condition,
        negotiable,
        imageUrl: "https://via.placeholder.com/400x250", //need to replace this
        createdAt: serverTimestamp(),
        userId: user.uid // Firestore security
    });

      console.log("Listing added with ID:", docRef.id);
      navigate('/listing-success', { state: { listingTitle: title } });
    } catch (error) {
      console.error("Error adding listing:", error);
      setErrorMessage("Something went wrong. Please try again.");
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

  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
    });
    return () => unsubcribe();
  }, []);

  return (
    <div className="page-section" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <Container className="text-start">
        <h1 className="title-underline-1" style={{ fontSize: '2.2rem', textAlign: 'left', marginTop: '2rem', color: '#E63946', fontWeight: 700 }}>Sell your part</h1>
        <Row>
          <Col md={6}>
            <Form onSubmit={handleSubmit} id="listingForm" style={{ textAlign: 'left', background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 12px rgba(230,57,70,0.07)', padding: '2rem' }}>
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
                  <option value="Refurbished">Refurbished</option>
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

              {errorMessage && <p style={{ color: 'grey', fontStyle: 'italic', marginTop: '10px' }}>{errorMessage}</p>}

              {/* Additional Information section - now collapsible */}
              <div style={{ marginTop: '3rem' }}>
                <div
                  style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => setShowAdditionalInfo((prev) => !prev)}
                  aria-expanded={showAdditionalInfo}
                  tabIndex={0}
                  onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') setShowAdditionalInfo((prev) => !prev); }}
                >
                  <h2 style={{ fontSize: '1.7rem', textAlign: 'left', marginBottom: 0, color: '#E63946', fontWeight: 600 }}>
                    Additional information
                  </h2>
                  {showAdditionalInfo ? (
                    <FaChevronUp style={{ marginLeft: 12, color: '#E63946' }} />
                  ) : (
                    <FaChevronDown style={{ marginLeft: 12, color: '#E63946' }} />
                  )}
                </div>
                {showAdditionalInfo && (
                  <>
                    <div style={{ marginTop: '1rem', color: '#555', fontSize: '1rem', textAlign: 'left' }}>
                      Help buyers find the right item, your product, by adding extra information.
                    </div>
                    <div style={{ marginBottom: '2rem', marginTop: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.2rem', textAlign: 'left', marginBottom: '1rem', color: '#E63946', fontWeight: 600 }}>Suitable for</h3>
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
                              placeholder="Select or type manufacturer"
                              allowNew
                            />
                            {showOtherManufacturerField && (
                              <Form.Control
                                type="text"
                                placeholder="Enter manufacturer"
                                value={manufacturer}
                                onChange={e => setManufacturer(e.target.value)}
                                className="mt-2"
                              />
                            )}
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId="formModel">
                            <Form.Label>Model</Form.Label>
                            <Form.Control type="text" placeholder="Enter model" value={model} onChange={e => setModel(e.target.value)} />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                      <h3 style={{ fontSize: '1.2rem', textAlign: 'left', marginBottom: '1rem', color: '#E63946', fontWeight: 600 }}>Part details</h3>
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
                    <div style={{ marginBottom: '2rem' }}>
                      <h3 style={{ fontSize: '1.2rem', textAlign: 'left', marginBottom: '1rem', color: '#E63946', fontWeight: 600 }}>Comments</h3>
                      <Form.Group controlId="formComments">
                        <Form.Label>Comments (optional)</Form.Label>
                        <Form.Control as="textarea" rows={2} placeholder="Add any extra notes or comments for buyers" />
                      </Form.Group>
                    </div>
                  </>
                )}
              </div>
              {user && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '2.5rem 0 2rem 0' }}>
                  <Button
                    style={{ backgroundColor: '#E63946', borderColor: '#E63946', color: 'white', fontWeight: 600, borderRadius: '2rem', padding: '0.7rem 2.5rem', fontSize: '1.15rem' }}
                    type="submit"
                  >
                    Post
                  </Button>
                </div>
              )}
            </Form>
          </Col>
          <Col md={6}>
            <div {...getRootProps()} style={{
              border: '2px dashed #E63946',
              padding: '15px',
              minHeight: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isDragActive ? '#ffeaea' : '#fff',
              textAlign: 'center',
              cursor: 'pointer',
              borderRadius: '1rem',
              boxShadow: '0 2px 12px rgba(230,57,70,0.07)'
            }}>
              <input {...getInputProps()} />
              {
                files.length > 0 ? (
                  <div>
                    {files.map(file => (
                      <img src={file.preview} key={file.path} alt={file.path} style={{ maxWidth: '100%', maxHeight: '280px', borderRadius: '0.5rem', boxShadow: '0 2px 8px rgba(230,57,70,0.10)' }} />
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#E63946', fontWeight: 500 }}>Drag and drop your photos here or click to select files. <span style={{ color: 'red' }}>*</span></p>
                )
              }
            </div>
          </Col>
        </Row>
      </Container>

      <Modal show={showLoginModal} onHide={handleCloseLoginModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Log in</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Button
            variant="primary"
            onClick={handleGoogleSignIn}
            style={{ backgroundColor: '#4285F4', borderColor: '#4285F4', color: 'white', fontWeight: 600, borderRadius: '2rem', padding: '0.5rem 2rem' }}
          >
            Log-in with Google
          </Button>
        </Modal.Body>
      </Modal>
      {!user && (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2.5rem 0 2rem 0' }}>
          <Button
            style={{ backgroundColor: '#FF6600', borderColor: '#FF6600', color: 'white', fontWeight: 600, borderRadius: '2rem', padding: '0.7rem 2.5rem', fontSize: '1.15rem' }}
            onClick={() => navigate('/login?redirect=/create-listing')}
          >
            Sign up or Log in
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreateListing;
