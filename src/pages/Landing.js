
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Row, Col, Button, Carousel } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import nlp from 'compromise';
import logo from '../assets/logo.png';

const Landing = () => {
  const [year, setYear] = useState('');
  const [model, setModel] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [showOtherManufacturerField, setShowOtherManufacturerField] = useState(false);
  const [partNumber, setPartNumber] = useState('');
  const [keyword, setKeyword] = useState('');
  const [anyPartSearch, setAnyPartSearch] = useState('');
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

  const handleAnyPartSearchChange = (e) => {
    const text = e.target.value;
    setAnyPartSearch(text);

    const doc = nlp(text);

    // Extract Year (simple regex for 4 digits)
    const yearMatch = text.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      setYear(yearMatch[0]);
    } else {
      setYear('');
    }

    // Extract Part Number (assuming it might be alphanumeric, often with hyphens or spaces)
    // This is a very basic attempt and might need refinement based on actual part number formats
    const partNumberMatch1 = text.match(/\b\d{6,10}\b/);
    const partNumberMatch2 = text.match(/\b\d{4,6}-?\d{3,5}\b/);
    const partNumberMatch3 = text.match(/\b[A-Z0-9]{3}\.[A-Z0-9]{3}\.[A-Z0-9]{3,}\b/i);

    if (partNumberMatch1) {
      setPartNumber(partNumberMatch1[0]);
    } else if (partNumberMatch2) {
      setPartNumber(partNumberMatch2[0]);
    } else if (partNumberMatch3) {
      setPartNumber(partNumberMatch3[0]);
    } else {
      setPartNumber('');
    }

    // Extract Manufacturer and Model (more complex, requires better NLP or a predefined list)
    // For now, let's try to extract nouns as potential manufacturers/models
    const nouns = doc.nouns().out('array');
    const carData = {
      "Toyota": ["Corolla", "Camry", "Hilux", "LandCruiser", "RAV4", "Yaris", "Prado", "Kluger", "Avalon"],
      "Mazda": ["Mazda 2", "Mazda 3", "Mazda 6", "CX-3", "CX-5", "CX-8", "CX-9", "BT-50"],
      "Hyundai": ["i20", "i30", "i40", "iLoad", "Tucson", "Santa Fe", "Kona", "Elantra", "Accent"],
      "Ford": ["Focus", "Fiesta", "Falcon", "Ranger", "Everest", "Territory", "Escape", "EcoSport"],
      "Holden": ["Commodore", "Cruze", "Barina", "Captiva", "Colorado", "Astra", "Trax", "Equinox"],
      "Kia": ["Rio", "Cerato", "Sportage", "Seltos", "Sorento", "Stinger", "Carnival", "Picanto"],
      "Nissan": ["Navara", "X-Trail", "Qashqai", "Patrol", "Pulsar", "Dualis", "Juke", "Murano"],
      "Honda": ["Civic", "Accord", "CR-V", "HR-V", "Jazz", "Odyssey", "City"],
      "Mitsubishi": ["Lancer", "Outlander", "ASX", "Triton", "Pajero", "Eclipse Cross", "Mirage"],
      "Subaru": ["Impreza", "Liberty", "Forester", "Outback", "XV", "BRZ", "Levorg"],
      "Volkswagen": ["Golf", "Polo", "Passat", "Tiguan", "Amarok", "Transporter", "Touareg"],
      "BMW": ["1 Series", "2 Series", "3 Series", "5 Series", "X1", "X3", "X5"],
      "Mercedes-Benz": ["A-Class", "B-Class", "C-Class", "E-Class", "GLA", "GLC", "GLE"],
      "Audi": ["A1", "A3", "A4", "A5", "A6", "Q2", "Q3", "Q5"],
      "Jeep": ["Cherokee", "Grand Cherokee", "Compass", "Wrangler", "Renegade"],
      "Isuzu": ["D-MAX", "MU-X"],
      "Suzuki": ["Swift", "Baleno", "Vitara", "Jimny", "S-Cross", "Ignis"],
      "Renault": ["Clio", "Koleos", "Captur", "Megane", "Trafic"],
      "Peugeot": ["208", "308", "3008", "5008", "Partner"],
      "LDV": ["T60", "D90", "G10", "V80", "Deliver 9"]
    };

    let foundManufacturer = '';
    let foundModel = '';

    for (const manufacturerKey in carData) {
      if (text.toLowerCase().includes(manufacturerKey.toLowerCase())) {
        foundManufacturer = manufacturerKey;
        const models = carData[manufacturerKey];
        for (const modelKey of models) {
          if (text.toLowerCase().includes(modelKey.toLowerCase())) {
            foundModel = modelKey;
            break;
          }
        }
        break;
      }
    }

    setManufacturer(foundManufacturer);
    setModel(foundModel);

    // Extract Keyword (everything else, or specific terms)
    // For simplicity, let's just use the original text as keyword if other fields are not fully populated
    setKeyword(text);
  };

  const years = [];
  for (let i = 1940; i <= 2026; i++) {
    years.push(i);
  }

  const handleSearch = () => {
    const queryParams = new URLSearchParams({
      year,
      manufacturer,
      model,
      partNumber,
      keyword,
    }).toString();
    navigate(`/results?${queryParams}`);
  };

  return (
    <div className="page-section">
      <Container className="text-start">
        <Form.Group controlId="formAnyPartSearch" className="mb-4">
          <Form.Control type="text" placeholder="Search any part" className="form-control-lg" value={anyPartSearch} onChange={handleAnyPartSearchChange} style={{ border: '1px solid rgb(255, 102, 0)' }} />
        </Form.Group>

        <h1 className="title-underline-1" style={{ fontSize: '24pt' }}>Manually search for a part</h1>
        <Form>
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
                        setManufacturer(''); // Clear manufacturer when 'Other' is selected
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
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formPartNumber">
                <Form.Label>Part Number</Form.Label>
                <Form.Control type="text" placeholder="Enter part number" value={partNumber} onChange={(e) => setPartNumber(e.target.value)} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formKeyword">
                <Form.Label>Keyword</Form.Label>
                <Form.Control type="text" placeholder="Enter keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
              </Form.Group>
            </Col>
            <Col className="d-flex align-items-end">
              <Button style={{ backgroundColor: 'rgb(198, 32, 32)', borderColor: 'rgb(198, 32, 32)', color: 'white' }} onClick={handleSearch} className="w-100">
                Search
              </Button>
            </Col>
          </Row>
        </Form>

        <div className="mt-5">
          <h1 className="title-underline-1" style={{ fontSize: '24pt' }}>Featured</h1>
          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={logo}
                alt="First slide"
              />
              <Carousel.Caption>
                <h3>First slide label</h3>
                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={logo}
                alt="Second slide"
              />

              <Carousel.Caption>
                <h3>Second slide label</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={logo}
                alt="Third slide"
              />

              <Carousel.Caption>
                <h3>Third slide label</h3>
                <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={logo}
                alt="Fourth slide"
              />

              <Carousel.Caption>
                <h3>Fourth slide label</h3>
                <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>
      </Container>
    </div>
  );
};

export default Landing;
