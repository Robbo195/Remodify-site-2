import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import australiaMap from '../assets/australia_map.png';

const About = () => {
  return (
    <div className="page-section padding-top-50">
      <Container>
        <h1 className="title-underline-2 text-left">About Us</h1>
        <Row className="align-items-center">
          <Col md={8}>
            <div className="highlight-box">
              <p className="text-left">
                Australia is a vast and isolated continent, with six states and two territories spread across the world's largest island. This unique geography often makes it challenging to source high-quality, affordable car parts.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <img src={australiaMap} alt="Map of Australia" className="img-fluid" />
          </Col>
        </Row>
        <p className="text-left">Remodify is made by car enthusiasts for car enthusiasts. And not just enthusiasts - wreckers, mechanics and anyone needing a part for their car or motorbike. Whether for your track car, project car, daily driver or offroad/touring rig, Remodify is the all-in-one marketplace which facilitates easy and safe transactions.</p>
        <p className="text-left">Other marketplaces are too cluttered, aren’t easy to filter, and most importantly, aren’t safe, opening both buyer and seller up to being scammed. And often in Australia, we are divided too easily by location.</p>
        <p className="text-left">As car lovers, we appreciate that we want the highest quality parts for our cars but buying brand new is not always feasible.</p>
        <p className="text-left">Remodify aims to break down the location barriers that motoring enthusiasts in Australia face - state to state, rural and region and between capital cities.</p>
      </Container>
    </div>
  );
};

export default About;