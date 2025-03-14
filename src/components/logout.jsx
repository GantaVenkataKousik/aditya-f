import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await fetch('http://localhost:5000/logout', {
          method: 'GET',
          credentials: 'include', // Ensure cookies are included
        });

        if (response.ok) {
          // Clear token from local storage
          localStorage.removeItem('token');
          // Redirect to welcome page
          navigate('/');
        } else {
          console.error('Failed to logout, status:', response.status);
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    logout();
  }, [navigate]);

  return null; // No UI is rendered
};

export default Logout;