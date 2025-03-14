import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../images/aditya1.png';
import { useState } from 'react';
import { FaSortDown } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
const Welcome = () => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);

  const handleLoginClick = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa',
        width: '100vw',
        textAlign: 'center',
      }}
    >
      {/* Centered Logo */}
      <div>
        <img
          src={Logo}
          alt="logo"
          style={{ width: '30vw', height: '45vh' }} // Adjust size for a bigger logo
        />
      </div>

      {/* Login Button */}
      <div style={{ position: 'relative' }}>
        <button
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#fff',
            backgroundColor: '#ff7f27',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            margin: '10px 0',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#ff0000')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#ff7f27')}
          onClick={handleLoginClick}
        >
          <div className='flex items-center h-5'>
            <h3>Login as</h3> <span className='ml-1'><FaSortDown /></span>
          </div>
        </button>

        {/* Dropdown Options */}
        {showOptions && (
          <div
            style={{
              position: 'absolute',
              top: '0', // Aligns with the top of the button
              left: '100%', // Positions the dropdown to the right of the button
              marginLeft: '10px', // Spacing between the button and the dropdown
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#f9f9f9',
              zIndex: 10, // Ensures it appears above other elements
              textAlign: 'left',
              minWidth: '180px', // Ensures consistent dropdown width
              transition: 'opacity 0.3s ease, transform 0.3s ease', // Smooth animation
              opacity: showOptions ? 1 : 0,
              transform: showOptions ? 'translateX(0)' : 'translateX(-10px)', // Slight slide-in effect
            }}
          >
            <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
              {[
                { role: 'Faculty', link: '/signin' },
                { role: 'HOD', link: '/signin' },
                { role: 'Dean', link: '/signin' },

                { role: 'Admin', link: '/signin' },
              ].map((option, index) => (
                <li
                  key={index}
                  style={{
                    margin: '5px 0',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '5px',
                    transition: 'background-color 0.3s ease, transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ff7f27';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <Link
                    to={option.link}
                    style={{
                      textDecoration: 'none',
                      color: '#007bff',
                      fontWeight: 'bold',
                      fontSize: '16px',
                    }}
                  >
                    {option.role}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}


      </div>

      {/* Sign-Up Link */}
      <div>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 'normal',
            margin: '10px 0',
          }}
        >
          Don't have an account?{' '}
          <Link
            to="/signup"
            style={{
              color: '#ff7f27',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
          >
            Sign Up
          </Link>
        </h2>
      </div>
    </div >
  );
};

export default Welcome;
