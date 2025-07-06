import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Dropdown } from 'react-bootstrap';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import profileIcon from '../assets/profile_icon.jpg';

const ProfileIcon = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };
  return (
    <Dropdown align="end">
      <Dropdown.Toggle as="span" style={{ cursor: 'pointer', display: 'inline-block' }} tabIndex={0}>
        <Image 
          src={profileIcon} 
          alt="Profile" 
          roundedCircle 
          style={{ width: '30px', height: '30px' }} 
        />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => navigate('/account')}>My details</Dropdown.Item>
        <Dropdown.Item onClick={() => navigate('/saved-listings')}>Saved listings</Dropdown.Item>
        <Dropdown.Item onClick={() => navigate('/saved-searches')}>Saved searches</Dropdown.Item>
        <Dropdown.Item onClick={() => navigate('/my-listings')}>My listings</Dropdown.Item>
        <Dropdown.Item onClick={() => navigate('/messages')}>Messages</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={() => navigate('/settings')}>Settings</Dropdown.Item>
        <Dropdown.Item onClick={handleLogout}>Log out</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProfileIcon;
