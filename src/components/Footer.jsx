import React from 'react';
import logo from '../images/logo.png';
import map from '../images/map.png';
import { IoLocationSharp } from "react-icons/io5";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { LuPrinter } from "react-icons/lu";

const Footer = () => {
  return (
    <div style={{ backgroundColor: '#002b5e', color: '#fff', padding: '20px', fontSize: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Left Section */}
        <div style={{ width: '30%' }}>
          <img
            src={logo} 
            alt="Aditya University Logo"
            style={{ width: '250px', marginBottom: '15px' }}
          />
          <p style={{color:"white"}}>
          <IoLocationSharp />ADITYA UNIVERSITY
            <br />
            Aditya Nagar, ADB Road, Surampalem - Pin:533437
            <br />
            Kakinda District, Andhra Pradesh, INDIA.
          </p>
          <p style={{color:"white"}}>
          <MdOutlinePhoneAndroid />
            <strong>Phone:</strong> 0884-23 26 202, +91 99498 76662, +91 99897 76661
            <br />
            <MdOutlinePhoneAndroid />
            <strong>WhatsApp:</strong> +91 7036076661
            <br />
            <LuPrinter />
            <strong>Fax:</strong> 0884-2326203
            <br />
            <MdEmail />
            <strong>Email:</strong> office@aec.edu.in
          </p >
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <a href="#" style={{ color: '#ffffff' }}>
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" style={{ color: '#fff' }}>
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" style={{ color: '#fff' }}>
              <i className="fab fa-youtube"></i>
            </a>
            <a href="#" style={{ color: '#fff' }}>
              <i className="fab fa-whatsapp"></i>
            </a>
            <a href="#" style={{ color: '#fff' }}>
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        {/* Center Section */}
        <div style={{ width: '40%', textAlign: 'center', position: 'relative' }}>
  {/* Heading and Button Container */}
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
    <h3 style={{ margin: 0 }}>REACH US :</h3>
    <a href="https://www.google.co.in/maps/place/Aditya+Engineering+College/@17.089415,82.0642246,17z/data=!3m1!4b1!4m6!3m5!1s0x3a378165aaaaaaab:0x481e8b12b4b80715!8m2!3d17.0894099!4d82.0667995!16s%2Fm%2F0h97fby?entry=ttu&g_ep=EgoyMDI1MDEwMS4wIKXMDSoJLDEwMjExMjM0SAFQAw%3D%3D">
    <button
      style={{
        backgroundColor: '#4fc3f7',
        border: 'none',
        padding: '10px',
        cursor: 'pointer',
        borderRadius: '5px',
        textDecoration: 'none',
        color: 'white',
        transition: 'color 0.3s ease',
      }}
      onMouseEnter={(e) => (e.target.style.color = '#007bff')}
      onMouseLeave={(e) => (e.target.style.color = '#555')}
    >
      360<sup>o</sup> View
    </button>
  </a>
    
  </div>

  {/* Bottom Border */}
  <div
    style={{
      borderBottom: '2px solid #ccc',
      marginBottom: '10px',
      width: '100%',
    }}
  ></div>

  {/* Google Maps Iframe */}
  <a href="https://www.google.co.in/maps/place/Aditya+Engineering+College/@17.089415,82.0642246,17z/data=!3m1!4b1!4m6!3m5!1s0x3a378165aaaaaaab:0x481e8b12b4b80715!8m2!3d17.0894099!4d82.0667995!16s%2Fm%2F0h97fby?entry=ttu&g_ep=EgoyMDI1MDEwMS4wIKXMDSoJLDEwMjExMjM0SAFQAw%3D%3D">
  <img src={map} alt="map" style={{width:'70%', height:"200", border:'0'}} />
  </a>
  
</div>

        {/* Right Section */}
<div style={{ width: '20%' }}>
  <h3 style={{ marginBottom: '15px', color: '#4fc3f7' }}>OFFICES</h3>
  <ul style={{ listStyleType: 'disc', paddingLeft: '20px', lineHeight: '1.8' }}>
    <li>Corporate office</li>
    <li>International Admissions</li>
    <li>Bihar</li>
    <li>Jharkhand</li>
    <li>Kerala</li>
    <li>Bangladesh</li>
    <li>West Bengal</li>
  </ul>
</div>

      </div>

      {/* Bottom Section */}
      <div
        style={{
          color:'white',
          textAlign: 'center',
          borderTop: '1px solid #fff',
          paddingTop: '10px',
          marginTop: '20px',
        }}
      >
        <p style={{color:'white'}}>Aditya University © 2024 - All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
