
import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Typeahead } from 'react-bootstrap-typeahead';

// nlp library previously used for basic parsing; removed to avoid unused import
import logo from '../assets/logo.png';

const Landing = () => {
  const [year, setYear] = useState('');
  const [model, setModel] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [showOtherManufacturerField, setShowOtherManufacturerField] = useState(false);
  const [partNumber, setPartNumber] = useState('');
  const [keyword, setKeyword] = useState('');
  const [anyPartSearch, setAnyPartSearch] = useState('');
  const [showManualSearch, setShowManualSearch] = useState(false);
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

  // basic NLP available if we want to expand parsing later

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
  // For now, let's attempt to identify manufacturers/models from the input
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
  for (let i = 2026; i >= 1940; i--) {
    years.push(i);
  }

  const handleSearch = () => {
    console.log('Search triggered'); //debug
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
    <>
      <div className="hero-background">
  <Container>
    <h1 className="text-center mb-4" style={{ fontSize: '36pt' }}>
      What part are you looking for today?
    </h1>

    <Row className="justify-content-center mb-2">
      <Col md={10} lg={8}>
        <Form.Group controlId="formAnyPartSearch" style={{ position: 'relative' }}>
          <Form.Control
            type="text"
            placeholder="Search any part"
            className="form-control-lg"
            value={anyPartSearch}
            onChange={handleAnyPartSearchChange}
            style={{
              width: '100%',
              padding: '14px 44px 14px 20px',
              fontSize: '1rem',
              border: '1px solid #ccc',
              borderRadius: '6px',
            }}
          />
          <FaSearch
            style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', color: '#b01c1c', fontSize: '1.2rem', cursor: 'pointer', zIndex: 2 }}
            onClick={handleSearch}
            title="Search"
            tabIndex={0}
            onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') handleSearch(); }}
          />
        </Form.Group>
        <div className="d-flex justify-content-center mt-3">
          <Button
            style={{
              fontWeight: 600,
              fontSize: '1.1rem',
              borderRadius: '6px',
              padding: '10px 32px',
              backgroundColor: '#E63946',
              color: 'white',
              border: '2px solid #B01C1C',
              boxShadow: '0 2px 8px rgba(230,57,70,0.10)'
            }}
            onClick={() => setShowManualSearch((prev) => !prev)}
            aria-expanded={showManualSearch}
          >
            Search manually
          </Button>
        </div>
      </Col>
    </Row>

    {showManualSearch && (
      <div style={{ marginTop: '40px' }}>
        <div className="search-box p-4 border rounded shadow-sm">
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
                <Button style={{ backgroundColor: '#b01c1c', color: 'white', border: 'none', padding: '12px 20px', fontSize: '1rem', borderRadius: '4px' }} onClick={handleSearch} className="w-100">
                  Search
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    )}
  </Container>

    {/* Slogan below searching fields, hidden when manual search is open */}
    {!showManualSearch && (
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <AnimatedSlogan />
          </Col>
        </Row>
      </Container>
    )}
    <div className="curve-divider">
      <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="#f0f0f0"
          fillOpacity="1"
          d="M0,160L80,149.3C160,139,320,117,480,133.3C640,149,800,203,960,218.7C1120,235,1280,213,1360,202.7L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
        ></path>
      </svg>
    </div>
</div>
      <div style={{ padding: '80px 0' }}>
  <Container>
    <div>
      <h1 className="title-underline-1" style={{ fontSize: '24pt' }}>Tailored picks for you</h1>
      <Slider
  slidesToShow={4}
  slidesToScroll={1}
  autoplay={true}
  autoplaySpeed={3000}
  infinite={true}
  arrows={false}
  dots={false}
  responsive={[
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
      }
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1,
      }
    }
  ]}
>
  {[1, 2, 3, 4, 5, 6].map((item, index) => (
    <div key={index} style={{ padding: '10px' }}>
      <div style={{
        backgroundColor: '#eee',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center'
      }}>
        <img src={logo} alt={`Slide ${index}`} style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
        <h5>Item {index + 1}</h5>
        <p>Part description or metadata</p>
      </div>
    </div>
  ))}
</Slider>
    </div>
    <div style={{ marginTop: '48px', textAlign: 'center' }}>
      <h2 style={{ fontSize: '24pt', marginBottom: '12px' }}>I'm chasing...</h2>
  <p style={{ color: '#555', maxWidth: 760, margin: '0 auto' }}>Can't find the part you need? Post a 'Want to Buy' and get alerted — sellers reach out when they list matching items, so you beat other buyers.</p>
      <div className="d-flex justify-content-center" style={{ marginTop: '16px' }}>
        <Button
          as={Link}
          to="/wtb"
          variant="outline-danger"
          style={{ borderRadius: '8px', fontWeight: 700, padding: '12px 24px', transition: 'background 0.15s, color 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#E63946'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#B01C1C'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = ''; e.currentTarget.style.borderColor = ''; }}
        >Post a WTB</Button>
      </div>
    </div>
  </Container>
</div>
    </>
  );
};

// Animated slogan words (kept outside component to avoid effect dependencies)
const SLOGAN_WORDS = ['mum bus', 'show pony', 'pavement princess', 'weekend warrior', 'rice cooker', 'chick magnet']

// Animated slogan component
const AnimatedSlogan = () => {
  const words = SLOGAN_WORDS;
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [caretBlink, setCaretBlink] = useState(false);
  const [sloganError, setSloganError] = useState('');

  useEffect(() => {
    let timeout;
    try {
      if (!words || words.length === 0) return undefined;
      const currentWord = words[index] || '';

      if (!deleting) {
        // Typing (slower)
        if (charIndex < currentWord.length) {
          // ensure caret not blinking while typing
          if (caretBlink) setCaretBlink(false);
          // Slightly slower typing
          timeout = setTimeout(() => {
            setDisplay(currentWord.slice(0, charIndex + 1));
            setCharIndex(ci => ci + 1);
          }, 220);
        } else {
          // Word fully typed: enable caret blink during the pause, then delete
          if (!caretBlink) setCaretBlink(true);
          timeout = setTimeout(() => {
            setDeleting(true);
            setCaretBlink(false);
          }, 1600);
        }
      } else {
        // Deleting (slower)
        if (charIndex > 0) {
          // Slightly slower deleting
          timeout = setTimeout(() => {
            setDisplay(currentWord.slice(0, charIndex - 1));
            setCharIndex(ci => ci - 1);
          }, 150);
        } else {
          // Move to next word
          setDeleting(false);
          setIndex(i => (i + 1) % words.length);
          setCharIndex(0);
          // ensure caret is off while starting to type next word
          if (caretBlink) setCaretBlink(false);
        }
      }
    } catch (err) {
      console.error('AnimatedSlogan error', err);
      setSloganError(err?.message || String(err));
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, index, words, caretBlink]);

  return (
    <div>
  <div className="text-center mb-5 animated-slogan" style={{
        fontSize: '2.2rem',
        color: '#E63946',
        fontWeight: 800,
  fontStyle: 'normal',
        letterSpacing: '1.5px',
        textShadow: '0 2px 12px rgba(230,57,70,0.10)',
        background: 'linear-gradient(90deg, #fff 60%, #ffeaea 100%)',
        borderRadius: '1.5rem',
        padding: '1.2rem 0 1.2rem 0',
        margin: '60px auto 0 auto',
        maxWidth: '100%',
        boxShadow: '0 4px 24px rgba(230,57,70,0.10)'
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'nowrap' }}>
          <span>Securely find parts for your</span>
          <span className="animated-slogan-word" style={{ color: '#000000', display: 'inline-block', whiteSpace: 'nowrap' }}>{display}<span className={`animated-slogan-caret ${caretBlink ? 'blink' : ''}`} style={{ borderRight: '2px solid #000000', marginLeft: '4px' }} /></span>
        </span>
      </div>
      {sloganError && (
        <div style={{ color: 'red', textAlign: 'center' }}>Slogan error: {sloganError}</div>
      )}
    </div>
  );
};

export default Landing;
