import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');// HEllo

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://aditya-b.onrender.com/login/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Store token, userId, and role in local storage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('userRole', data.role);

      navigate("/home");
    } catch (error) {
      console.error('fetching failed', error.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid #ccc',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          padding: '20px',
          backgroundColor: '#f9f9f9',
          width: '50%',
        }}
      >
        <h2
          style={{
            marginBottom: '20px',
            color: '#333',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          Sign In
        </h2>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{ marginBottom: '15px', padding: '10px' }}>
            <label
              htmlFor="email"
              style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}
            >
              Email Address:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px', padding: '10px' }}>
            <label
              htmlFor="password"
              style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#ff7f27',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#ff7f27')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#f94d00')}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>

  );
};

export default Signin;