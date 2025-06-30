
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

const Results = () => {
  const location = useLocation();
  const { year, model, manufacturer, partNumber, keyword } = location.state || {};

  return (
    <div className="page-section">
      <Container className="text-start">
        <h1 className="title-underline-1">Results</h1>
        <p className="fst-italic">
          You searched for a {year} {manufacturer} {model} {partNumber && `part number ${partNumber}`} {keyword && `(${keyword})`}.
        </p>

        <Row className="mt-4">
          {[...Array(6)].map((_, index) => (
            <Col key={index} lg={4} md={6} sm={12} className="mb-4">
              <div style={{
                border: '1px solid #ddd',
                padding: '15px',
                minHeight: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f9f9f9'
              }}>
                Listing {index + 1}
                {/* Placeholder for image and listing details */}
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Results;
