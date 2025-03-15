import React from 'react';
import { CgProfile } from "react-icons/cg";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import headlogo from '../images/aditya-full.png';
import { useState, useEffect } from 'react';
import { FaHome } from 'react-icons/fa';
import { IoLogOutOutline } from "react-icons/io5";

const Navbar = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [user, setUser] = useState({});

  const Remove = async () => {
    try {
      const response = await fetch('https://aditya-b.onrender.com/logout', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/fetchData', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error('Failed to fetch user:', response.statusText);
        }
      } catch (error) {
        console.error('Error occurred:', error);
      }
    };
    fetchUser();
  }, []);

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f8f9fa',

      }}
    >
      <div className='homeIcon' onClick={() => navigate('/home')} style={{ marginLeft: '20px', fontSize: '30px', cursor: 'pointer' }}> <FaHome /> </div>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', }}>
        <img src={headlogo} alt="HeadLogo" style={{ border: '0', height: '10vh', width: '40vw' }} />
      </div>
      <div>
        <button
          style={{
            backgroundColor: '#004b87',
            color: '#fff',
            padding: '5px 15px',
            border: 'none',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer',
          }}
          onClick={Remove}
        >
          Logout <IoLogOutOutline />

        </button>
      </div>
      {/* Centered Logo */}
    </nav>
  );
};

export default Navbar;
