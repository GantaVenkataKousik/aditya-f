import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../images/aditya1.png';
import { FaSortDown, FaGraduationCap, FaBook, FaCalendarAlt, FaNewspaper, FaLaptop, FaFlask, FaUsers } from "react-icons/fa";

const Welcome = () => {
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLoginClick = () => {
    setShowOptions(!showOptions);
  };

  const departments = [
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        position: 'relative',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        overflow: 'hidden'
      }}
    >
      <div className="background-illustrations" style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        overflow: 'hidden',
        zIndex: 0
      }}>
        <svg width="100%" height="100%" style={{
          position: 'absolute',
          opacity: 0.2,
          top: 0,
          left: 0
        }}>
          <pattern id="pattern-circles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
            <circle id="pattern-circle" cx="10" cy="10" r="2" fill="#4285F4"></circle>
          </pattern>
          <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
        </svg>

        {Array(5).fill().map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${Math.random() * 300 + 100}px`,
            height: `${Math.random() * 300 + 100}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(66, 133, 244, 0.1) 0%, rgba(255, 127, 39, 0.05) 70%, transparent 100%)`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`,
            animationDelay: `${Math.random() * 5}s`,
            zIndex: 0
          }}></div>
        ))}

        {Array(3).fill().map((_, i) => (
          <div key={`wave-${i}`} style={{
            position: 'absolute',
            width: '150%',
            height: '150vh',
            top: `${70 + i * 10}%`,
            left: '-25%',
            background: `rgba(255, 255, 255, ${0.03 - i * 0.01})`,
            borderRadius: '40%',
            transform: `rotate(${i % 2 === 0 ? '5deg' : '-5deg'})`,
            animation: `wave ${15 + i * 5}s infinite linear`,
            zIndex: 0
          }}></div>
        ))}
      </div>

      <div style={{
        zIndex: 1,
        width: '100%',
        maxWidth: '1200px',
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          maxWidth: '300px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transform: isLoaded ? 'scale(1)' : 'scale(0.9)',
          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          <img
            src={Logo}
            alt="College Logo"
            style={{
              maxWidth: '100%',
              height: 'auto',
              objectFit: 'contain'
            }}
          />
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: '800',
          color: '#333',
          marginBottom: '15px',
          textAlign: 'center',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
        }}>
          Welcome to the Faculty Appraisal System
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          lineHeight: '1.6',
          color: '#555',
          maxWidth: '700px',
          textAlign: 'center',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s',
        }}>
          Log in to Manage Your Professional Growth
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px',
          width: '100%',
          maxWidth: '700px',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s',
        }}>
          {[

          ].map((item, index) => (
            <Link
              to="/"
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 20px',
                backgroundColor: 'white',
                color: item.color,
                border: `2px solid ${item.color}`,
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '16px',
                cursor: 'pointer',
                textDecoration: 'none',
                width: '100%',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = item.color;
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = item.color;
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
              }}
            >
              {item.icon} {item.title}
            </Link>
          ))}
        </div>

        <h2 style={{
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          fontWeight: '700',
          color: '#333',
          marginBottom: '25px',
          textAlign: 'center',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.8s ease 0.7s',
          position: 'relative',
        }}>

          <div style={{
            width: '100px',
            height: '3px',
            background: '#ff7f27',
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            borderRadius: '3px'
          }}></div>
        </h2>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '50px',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.8s ease 0.8s',
        }}>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '400px',
          margin: '0 auto',
          padding: '20px',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.8s ease 1s, transform 0.8s ease 1s',
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            marginBottom: '15px',
          }} ref={dropdownRef}>
            <button
              style={{
                width: '100%',
                padding: '14px 25px',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#fff',
                backgroundColor: '#ff7f27',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f94d00';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ff7f27';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
              onClick={handleLoginClick}
            >
              <span>Login as</span>
              <FaSortDown style={{
                transform: showOptions ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.3s ease'
              }} />
            </button>

            {showOptions && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 5px)',
                  left: '0',
                  right: '0',
                  padding: '10px',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 -10px 25px rgba(0, 0, 0, 0.15)',
                  backgroundColor: 'white',
                  zIndex: 100,
                  textAlign: 'left',
                  animation: 'fadeInFromBottom 0.3s ease',
                  maxHeight: '300px',
                  overflowY: 'auto',
                }}
              >
                <ul style={{
                  listStyle: 'none',
                  padding: '0',
                  margin: '0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }}>
                  {[
                    { role: 'Faculty', link: '/signin' },
                    { role: 'HOD', link: '/signin' },
                    { role: 'Dean', link: '/signin' },
                    { role: 'Admin', link: '/signin' },
                  ].map((option, index) => (
                    <li key={index} style={{ borderRadius: '8px', overflow: 'hidden' }}>
                      <Link
                        to={option.link}
                        style={{
                          textDecoration: 'none',
                          color: '#333',
                          fontWeight: '500',
                          fontSize: '16px',
                          padding: '12px 15px',
                          display: 'block',
                          transition: 'all 0.2s ease',
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#ff7f27';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#333';
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

          <Link
            to="/signup"
            style={{
              width: '100%',
              padding: '14px 25px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#ff7f27',
              backgroundColor: 'white',
              border: '2px solid #ff7f27',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              display: 'block',
              textDecoration: 'none',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ff7f27';
              e.target.style.color = 'white';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.color = '#ff7f27';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
            }}
          >
            Create an Account
          </Link>
        </div>
      </div>

      <style>
        {`
          @keyframes float {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(30px, -30px) rotate(5deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
          }
          
          @keyframes wave {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes fadeInFromBottom {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default Welcome;
