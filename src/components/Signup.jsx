import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    designation: '',
    department: '',
    type: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.fullname) errors.fullname = 'Full Name is required';
    if (!data.email) errors.email = 'Email is required';
    if (!data.password) errors.password = 'Password is required';
    if (!data.designation) errors.designation = 'Designation is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch('http://localhost:5000/signup/register', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Signup failed');

        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        alert('Signup successful!');
        navigate('/signup/signup');
      } catch (error) {
        alert('An error occurred. Please try again.');
      }
    } else {
      setErrors(newErrors);
    }
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4',
    fontFamily: "'Poppins', sans-serif",
  };

  const formContainerStyle = {
    width: '400px',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  };

  const titleStyle = {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '14px',
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    cursor: 'pointer',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#ff7f27',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const errorStyle = {
    color: 'red',
    fontSize: '12px',
    marginBottom: '10px',
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1 style={titleStyle}>Complete Your Profile</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Full Name:</label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Enter your Full Name"
              style={inputStyle}
            />
            {errors.fullname && <span style={errorStyle}>{errors.fullname}</span>}
          </div>

          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your Email"
              style={inputStyle}
            />
            {errors.email && <span style={errorStyle}>{errors.email}</span>}
          </div>

          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your Password"
              style={inputStyle}
            />
            {errors.password && <span style={errorStyle}>{errors.password}</span>}
          </div>

          <div>
            <label>Designation:</label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="" disabled>
                Select your Designation
              </option>
              <option value="HOD">HOD</option>
              <option value="Faculty">Faculty</option>
              <option value="Dean">Dean</option>
              <option value="Admin">Admin</option>
            </select>
            {errors.designation && <span style={errorStyle}>{errors.designation}</span>}
          </div>

          {formData.designation === 'Dean' && (
            <div>
              <label>Type:</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                style={selectStyle}
              >
                <option value="" disabled>
                  Select the type
                </option>
                <option value="ENG">Dean of Engineering</option>
                <option value="PH">Dean of Pharmacy</option>
                <option value="BA">Dean of Business</option>
                <option value="DP">Dean of Diploma</option>
              </select>
            </div>
          )}

          {formData.designation !== 'Dean' && formData.designation !== 'Admin' && formData.designation && (
            <div>
              <label>Department:</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                style={selectStyle}
              >
                <option value="" disabled>
                  Select your Department
                </option>
                <option value="CSE">Computer Science and Engineering</option>
                <option value="ECE">Electronics and Communication</option>
                <option value="EE">Electrical Engineering</option>
                <option value="MECH">Mechanical Engineering</option>
                <option value="CIVIL">Civil Engineering</option>
                <option value="CHE">Chemical Engineering</option>
                <option value="BIO">Bio Engineering</option>
              </select>
            </div>
          )}

         

          <button
            type="submit"
            style={buttonStyle}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
