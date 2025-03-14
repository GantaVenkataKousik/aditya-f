import React from 'react';
import { Link } from 'react-router-dom';

const SignupSuccess = () => {
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to right, #ebf8ff, #bee3f8)',
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
    margin: '0 16px',
  };

  const headingStyle = {
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '24px',
    color: '#1a202c',
  };

  const paragraphStyle = {
    marginBottom: '32px',
    fontSize: '1.125rem',
    color: '#4a5568',
  };

  const linkStyle = {
    display: 'inline-block',
    background: 'linear-gradient(to right, #4299e1, #3182ce)',
    color: 'white',
    padding: '16px 40px',
    borderRadius: '9999px',
    textDecoration: 'none',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'background 0.3s ease-in-out',
  };

  const linkHoverStyle = {
    background: 'linear-gradient(to right, #2b6cb0, #2c5282)',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>Registration Successful!</h2>
        <p style={paragraphStyle}>Your account has been created successfully. Please log in to continue.</p>
        <Link 
          to="/signin" 
          style={linkStyle}
          onMouseEnter={(e) => e.target.style.background = linkHoverStyle.background}
          onMouseLeave={(e) => e.target.style.background = linkStyle.background}
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default SignupSuccess;