import React, { useEffect, useRef } from 'react';
import './Services2.css';

const CurvedArrow = ({ className }) => (
  <svg
    width="120"
    height="40"
    viewBox="0 0 120 40"
    xmlns="http://www.w3.org/2000/svg"
    className={`curved-arrow ${className}`}>
    <defs>
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="7"
        refX="10"
        refY="3.5"
        orient="auto">
        <path d="M0,0 L0,7 L10,3.5 z" fill="black" />
      </marker>
    </defs>
    <path
      d="M10,20 Q60,10 110,20"
      stroke="black"
      strokeWidth="2"
      fill="none"
      markerEnd="url(#arrowhead)" />
  </svg>
);

const Services2 = () => {
  const triggerTopLeftRef = useRef(null);
  const triggerBottomLeftRef = useRef(null);
  const triggerMiddleLeftRef = useRef(null);
  const triggerTopUpperMiddleLeftRef = useRef(null);
  const scrollContentRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === 'trigger-top-left') {
              document.querySelector('.arrow-top-left')?.classList.add('visible');
              document.querySelector('.arrow-text-top-left')?.classList.add('visible');
            } else if (entry.target.id === 'trigger-bottom-left') {
              document.querySelector('.arrow-bottom-left')?.classList.add('visible');
              document.querySelector('.arrow-text-bottom-left')?.classList.add('visible');
            } else if (entry.target.id === 'trigger-middle-left') {
              document.querySelector('.arrow-middle-left')?.classList.add('visible');
              document.querySelector('.arrow-text-middle-left')?.classList.add('visible');
            } else if (entry.target.id === 'trigger-top-upper-middle-left') {
              document.querySelector('.arrow-top-upper-middle-left')?.classList.add('visible');
              document.querySelector('.arrow-text-top-upper-middle-left')?.classList.add('visible');
            }
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    const topLeft = triggerTopLeftRef.current;
    const bottomLeft = triggerBottomLeftRef.current;
    const middleLeft = triggerMiddleLeftRef.current;
    const topUpperMiddleLeft = triggerTopUpperMiddleLeftRef.current;

    if (topLeft) {
      observer.observe(topLeft);
    }
    if (bottomLeft) {
      observer.observe(bottomLeft);
    }
    if (middleLeft) {
      observer.observe(middleLeft);
    }
    if (topUpperMiddleLeft) {
      observer.observe(topUpperMiddleLeft);
    }

    // Cleanup observer on component unmount
    return () => {
      if (topLeft) {
        observer.unobserve(topLeft);
      }
      if (bottomLeft) {
        observer.unobserve(bottomLeft);
      }
      if (middleLeft) {
        observer.unobserve(middleLeft);
      }
      if (topUpperMiddleLeft) {
        observer.unobserve(topUpperMiddleLeft);
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="services-container">
      <div className="diagram-fixed-wrapper">
        {/* These are the sticky circles */}
        <div className="service-circle buyer">
          <img src="/profile_icon.png" alt="Buyer" className="circle-icon" />
          <div className="circle-text">
            <h3>Buyer</h3>
          </div>
        </div>
          <div className="service-circle remodify">
            <img src="/logo-removebg.png" alt="Remodify" className="circle-icon" />
          <div className="circle-remodify-text">
            <h3>Connecting you</h3>
         </div>
        </div>
        <div className="service-circle seller">
          <h3>Seller</h3>
          <p>Anyone with a spare part across Australia</p>
        </div>

        {/* These are the non-sticky arrows and their triggers */}
        <div className="diagram">
          <CurvedArrow className="arrow arrow-top-left" />
          <span className="arrow-text arrow-text-top-left">
            Payment held in secure-account
            <br />
            (including Packaging and Handling costs)
          </span>
          <CurvedArrow className="arrow arrow-bottom-left" />
          <span className="arrow-text arrow-text-bottom-left">
            Pre-paid shipping information
            <br />
            sent to Seller.
          </span>
          <CurvedArrow className="arrow arrow-middle-left" />
          <span className="arrow-text arrow-text-middle-left">
            Seller takes spare-part to post-office
            <br />
             and payment is released.
          </span>
          <CurvedArrow className="arrow arrow-top-upper-middle-left" />
          <span className="arrow-text arrow-text-top-upper-middle-left">
            Buyer is notified that spare-part 
            <br />
            is in transit with expected delivery.
          </span>
        </div>
      </div>

      <div className="scroll-content" ref={scrollContentRef}>

        {/* These triggers are positioned down the page to activate the arrows */}
        <section
          ref={triggerTopLeftRef}
          id="trigger-top-left"
          className="trigger"
        ></section>
        <section
          ref={triggerBottomLeftRef}
          id="trigger-bottom-left"
          className="trigger"
        ></section>
        <section
          ref={triggerMiddleLeftRef}
          id="trigger-middle-left"
          className="trigger"
        ></section>
        <section
          ref={triggerTopUpperMiddleLeftRef}
          id="trigger-top-upper-middle-left"
          className="trigger"
        ></section>
      </div>
    </div>
  );
};

export default Services2;
