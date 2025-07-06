
import React from 'react';
import { Link } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import profileIcon from '../assets/profile_icon.jpg';

const ProfileIcon = () => {
  return (
    <Link to="/account">
      <Image 
        src={profileIcon} 
        alt="Profile" 
        roundedCircle 
        style={{ cursor: 'pointer', width: '30px', height: '30px' }} 
      />
    </Link>
  );
};

export default ProfileIcon;
