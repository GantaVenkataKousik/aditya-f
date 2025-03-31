import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { IoLogOutOutline } from "react-icons/io5";
import headlogo from '../images/aditya-full.png';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`https://aditya-b.onrender.com/fetchData?userId=${userId}`, {
          method: 'GET',
          headers: {
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

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('https://aditya-b.onrender.com/logout', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        localStorage.removeItem('token');
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: scrolled ? 'rgba(248, 249, 250, 0.95)' : '#f8f9fa',
        boxShadow: scrolled ? '0 4px 10px rgba(0, 0, 0, 0.1)' : '0 2px 5px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        height: scrolled ? '80px' : '100px',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: scrolled ? '15px 40px' : '20px 40px',
          maxWidth: '1400px',
          margin: '0 auto',
          transition: 'padding 0.3s ease',
          height: '100%',
        }}
      >
        {/* Left - Home Icon */}
        <div
          className="nav-left"
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            className='home-button'
            onClick={() => navigate('/home')}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: '#1a4b88',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ff7f27';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1a4b88';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <FaHome />
          </div>
        </div>

        {/* Center - Logo */}
        <div
          className="nav-center"
          style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <div
            className="logo-container"
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/home')}
          >
            <img
              src={headlogo}
              alt="Aditya University"
              style={{
                height: scrolled ? '65px' : '75px',
                transition: 'height 0.3s ease',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>

        {/* Right - User Info & Logout */}
        <div
          className="nav-right"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
          }}
        >
          {user && user.fullname && (
            <div
              className="user-info"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                marginRight: '10px',
              }}
            >
              <div style={{ fontWeight: '600', color: '#333', fontSize: '16px' }}>
                {user.fullname}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>
                {user.designation || 'User'}
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#1a4b88',
              color: 'white',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ff7f27';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#1a4b88';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
            }}
          >
            Logout <IoLogOutOutline style={{ fontSize: '18px' }} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
