import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const ProfileIcon = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };
  return (
    <Dropdown align="end">
      <Dropdown.Toggle as="span" style={{ cursor: 'pointer', display: 'inline-block' }} tabIndex={0}>
        <svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '50%', background: 'white', padding: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <defs>
            <linearGradient id="remograd" x1="0" x2="1">
              <stop offset="0%" stopColor="#E63946" />
              <stop offset="100%" stopColor="#B01C1C" />
            </linearGradient>
          </defs>
          <circle cx="19" cy="19" r="16" fill="url(#remograd)" />
          <circle cx="19" cy="13" r="5" fill="white" />
          <path d="M9 28c1.5-3 4.5-5 10-5s8.5 2 10 5" fill="white" opacity="0.95" />
        </svg>
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
