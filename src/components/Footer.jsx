import React, { useState } from 'react';
import logo from '../images/logo.png';
import map from '../images/map.png';
import {
  IoLocationSharp,
  IoMailOutline,
  IoCallOutline,
  IoPrintOutline,
  IoLogoFacebook,
  IoLogoTwitter,
  IoLogoInstagram,
  IoLogoYoutube,
  IoLogoWhatsapp,
  IoArrowForward,
  IoChevronForwardOutline
} from "react-icons/io5";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setEmail('');
      // In a real app, you would send this to your server
    }
  };

  return (
    <footer>
      {/* Newsletter Section */}
      <div
        style={{
          background: '#0e316c',
          padding: '40px 0',
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '30px',
          }}
        >
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h2
              style={{
                fontSize: '32px',
                fontWeight: '700',
                marginBottom: '15px',
                color: 'white',
              }}
            >
              Stay Updated with Aditya University
            </h2>

            <div style={{ width: '70px', height: '3px', backgroundColor: '#ff7f27', marginBottom: '20px' }}></div>

            <p style={{ fontSize: '16px', color: 'white', opacity: '0.8', lineHeight: '1.5' }}>
              Subscribe to our newsletter to receive the latest news, events, and opportunities.
            </p>
          </div>

          <div style={{ flex: '0 0 auto', width: '300px' }}>
            <div
              style={{
                backgroundColor: '#ff7f27',
                color: 'white',
                padding: '18px 30px',
                borderRadius: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(255, 127, 39, 0.3)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e86b10';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ff7f27';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontWeight: '600', fontSize: '18px' }}>Subscribe</span>
              <IoArrowForward style={{ marginLeft: '10px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div
        style={{
          backgroundColor: '#071d45',
          color: '#fff',
          padding: '60px 0 30px',
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: '40px',
          }}
        >
          {/* Left Column - Contact Info */}
          <div style={{ flex: '1', minWidth: '300px', maxWidth: '400px' }}>
            <img
              src={logo}
              alt="Aditya University Logo"
              style={{ width: '220px', marginBottom: '30px' }}
            />

            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <IoLocationSharp style={{ color: '#ff7f27', fontSize: '20px', marginTop: '4px', flexShrink: 0 }} />
              <div>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '5px' }}>
                  ADITYA UNIVERSITY
                </h3>
                <p style={{ color: 'white', lineHeight: '1.6' }}>
                  Aditya Nagar, ADB Road, Surampalem - Pin:533437
                  <br />
                  Kakinda District, Andhra Pradesh, INDIA.
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <IoCallOutline style={{ color: '#ff7f27', fontSize: '18px', flexShrink: 0 }} />
              <div>
                <span style={{ fontWeight: '500', marginRight: '5px', color: 'white' }}>Phone:</span>
                <span style={{ color: 'white' }}>0884-23 26 202, +91 99498 76662, +91 99897 76661</span>
              </div>
            </div>

            <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <IoLogoWhatsapp style={{ color: '#ff7f27', fontSize: '18px', flexShrink: 0 }} />
              <div>
                <span style={{ fontWeight: '500', marginRight: '5px', color: 'white' }}>WhatsApp:</span>
                <span style={{ color: 'white' }}>+91 7036076661</span>
              </div>
            </div>

            <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <IoPrintOutline style={{ color: '#ff7f27', fontSize: '18px', flexShrink: 0 }} />
              <div>
                <span style={{ fontWeight: '500', marginRight: '5px', color: 'white' }}>Fax:</span>
                <span style={{ color: 'white' }}>0884-2326203</span>
              </div>
            </div>

            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <IoMailOutline style={{ color: '#ff7f27', fontSize: '18px', flexShrink: 0 }} />
              <div>
                <span style={{ fontWeight: '500', marginRight: '5px', color: 'white' }}>Email:</span>
                <a href="mailto:office@aec.edu.in" style={{ color: '#4fc3f7', textDecoration: 'none' }}>
                  office@aec.edu.in
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <a href="#" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#11265b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                transition: 'all 0.3s ease',
              }}>
                <FaFacebookF />
              </a>
              <a href="#" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#11265b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                transition: 'all 0.3s ease',
              }}>
                <FaTwitter />
              </a>
              <a href="#" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#11265b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                transition: 'all 0.3s ease',
              }}>
                <FaYoutube />
              </a>
              <a href="#" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#11265b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                transition: 'all 0.3s ease',
              }}>
                <FaWhatsapp />
              </a>
              <a href="#" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#11265b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                transition: 'all 0.3s ease',
              }}>
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Center Column - Map */}
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '600',
              marginBottom: '20px',
              color: 'white',
              position: 'relative',
              display: 'inline-block',
              paddingBottom: '5px'
            }}>
              REACH US
              <span style={{
                position: 'absolute',
                bottom: '-6px',
                left: '0',
                width: '40px',
                height: '3px',
                backgroundColor: '#ff7f27'
              }}></span>
            </h3>

            <div style={{ position: 'relative', marginTop: '20px' }}>
              <img
                src={map}
                alt="Google Maps location"
                style={{
                  width: '100%',
                  height: '220px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />

              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '12px',
                textAlign: 'center',
                borderBottomLeftRadius: '8px',
                borderBottomRightRadius: '8px',
              }}>
                Click to view on Google Maps
              </div>

              <a
                href="https://www.google.co.in/maps/place/Aditya+Engineering+College/@17.089415,82.0642246,17z/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  backgroundColor: '#4fc3f7',
                  color: 'white',
                  padding: '8px 15px',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '14px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#0288d1';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#4fc3f7';
                }}
              >
                360° View
              </a>
            </div>
          </div>

          {/* Right Column - Offices */}
          <div style={{ flex: '0 0 220px' }}>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '600',
              marginBottom: '20px',
              color: 'white',
              position: 'relative',
              display: 'inline-block',
              paddingBottom: '5px'
            }}>
              OFFICES
              <span style={{
                position: 'absolute',
                bottom: '-6px',
                left: '0',
                width: '40px',
                height: '3px',
                backgroundColor: '#ff7f27'
              }}></span>
            </h3>

            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: '20px 0 0 0',
            }}>
              {[
                'Corporate office',
                'International Admissions',
                'Bihar',
                'Jharkhand',
                'Kerala',
                'Bangladesh',
                'West Bengal'
              ].map((office, index) => (
                <li key={index} style={{
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <span style={{ color: '#ff7f27' }}>›</span>
                  <a href="#" style={{
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                  }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#ff7f27';
                      e.target.style.paddingLeft = '5px';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'white';
                      e.target.style.paddingLeft = '0';
                    }}>
                    {office}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div
        style={{
          backgroundColor: '#061938',
          color: 'rgba(255, 255, 255, 0.7)',
          padding: '20px 0',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px',
            textAlign: 'center',
          }}
        >
          <p style={{ margin: 0 }}>Aditya University © {new Date().getFullYear()} - All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
