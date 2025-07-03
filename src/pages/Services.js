import React, { useEffect, useState } from 'react';
import '../Services.css'; // styles defined separately
import mainDiagram from '../assets/process_remodify.png'; // Assuming process_remodify.png is your main diagram
import number1 from '../assets/number1.png';
import number2 from '../assets/number2.png';
import number3 from '../assets/number3.png';
import number4 from '../assets/number4.png';

const Services = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="services-wrapper">
      <div className="fixed-background">
        <img src={mainDiagram} alt="Remodify Process Diagram" className="main-image" />

        <div className="flow-container">
          <div className={`number-block fade-point ${scrollY > 50 ? 'show' : ''}`} style={{ top: '60px', left: '60px' }}>
            <img src={number1} alt="1" className="number-icon" />
            <p>Payment held in secure-account<br />(including Packaging and Handling costs).</p>
          </div>

          <div className={`number-block fade-point ${scrollY > 200 ? 'show' : ''}`} style={{ top: '60px', left: '850px' }}>
            <img src={number2} alt="2" className="number-icon" />
            <p>Pre-paid shipping information<br />sent to Seller.</p>
          </div>

          <div className={`number-block fade-point ${scrollY > 400 ? 'show' : ''}`} style={{ top: '300px', left: '800px' }}>
            <img src={number3} alt="3" className="number-icon" />
            <p>Pre-paid shipping information<br />sent to Seller.</p>
          </div>

          <div className={`number-block fade-point ${scrollY > 600 ? 'show' : ''}`} style={{ top: '300px', left: '150px' }}>
            <img src={number4} alt="4" className="number-icon" />
            <p>Buyer is notified that spare-part<br />is in transit with expected delivery.</p>
          </div>
        </div>
      </div>
      {/* Placeholder content to make the page scrollable */}
      <div style={{ height: '2000px', background: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)' }}>
        <p style={{ paddingTop: '1000px', textAlign: 'center' }}>Scroll down to see the animation!</p>
      </div>
    </div>
  );
};

export default Services;