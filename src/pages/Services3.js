import React from 'react';
import ModRexSwoosh from '../assets/ModRexSwoosh.png';

const Services3 = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '2rem',
      minHeight: 'calc(100vh - 140px)' // Adjust height to fill viewport below navbar and above footer
    }}>
      <img src={ModRexSwoosh} alt="ModRex Swoosh" style={{ maxWidth: '100%', maxHeight: '50vh', height: 'auto' }} />
      <h1 style={{ marginTop: '1rem' }}>Securely connecting you</h1>
    </div>
  );
};

export default Services3;
