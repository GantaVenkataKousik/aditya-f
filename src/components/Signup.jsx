import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        const response = await fetch('https://aditya-b.onrender.com/signup/register', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Signup failed');

        const data = await response.json();
        if (data.success) {
          localStorage.setItem('authToken', data.token);
          toast.success('Signup successful!');
          navigate('/signup/signup');
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '20px',
      fontFamily: "'Poppins', sans-serif",
    }}>
      <ToastContainer />
      <div style={{
        width: '100%',
        maxWidth: '500px',
        backgroundColor: '#fff',
        padding: '35px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '25px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#ff7f27',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="40px" height="40px">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>

        <h1 style={{
          textAlign: 'center',
          marginBottom: '25px',
          fontSize: '24px',
          fontWeight: '600',
          color: '#333',
        }}>Complete Your Profile</h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              fontSize: '14px',
              color: '#555'
            }}>
              Full Name:
            </label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Enter your Full Name"
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'border 0.3s ease',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.border = '1px solid #ff7f27'}
              onBlur={(e) => e.target.style.border = '1px solid #ddd'}
            />
            {errors.fullname && <span style={{ color: '#e74c3c', fontSize: '13px', marginTop: '5px', display: 'block' }}>{errors.fullname}</span>}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              fontSize: '14px',
              color: '#555'
            }}>
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your Email"
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'border 0.3s ease',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.border = '1px solid #ff7f27'}
              onBlur={(e) => e.target.style.border = '1px solid #ddd'}
            />
            {errors.email && <span style={{ color: '#e74c3c', fontSize: '13px', marginTop: '5px', display: 'block' }}>{errors.email}</span>}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              fontSize: '14px',
              color: '#555'
            }}>
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your Password"
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'border 0.3s ease',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.border = '1px solid #ff7f27'}
              onBlur={(e) => e.target.style.border = '1px solid #ddd'}
            />
            {errors.password && <span style={{ color: '#e74c3c', fontSize: '13px', marginTop: '5px', display: 'block' }}>{errors.password}</span>}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              fontSize: '14px',
              color: '#555'
            }}>
              Designation:
            </label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'border 0.3s ease',
                outline: 'none',
                boxSizing: 'border-box',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 15px top 50%',
                backgroundSize: '12px auto',
                cursor: 'pointer'
              }}
              onFocus={(e) => e.target.style.border = '1px solid #ff7f27'}
              onBlur={(e) => e.target.style.border = '1px solid #ddd'}
            >
              <option value="" disabled>
                Select your Designation
              </option>
              <option value="HOD">HOD</option>
              <option value="Faculty">Faculty</option>
              <option value="Dean">Dean</option>
              <option value="Admin">Admin</option>
            </select>
            {errors.designation && <span style={{ color: '#e74c3c', fontSize: '13px', marginTop: '5px', display: 'block' }}>{errors.designation}</span>}
          </div>

          {formData.designation === 'Dean' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '14px',
                color: '#555'
              }}>
                Type:
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'border 0.3s ease',
                  outline: 'none',
                  boxSizing: 'border-box',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 15px top 50%',
                  backgroundSize: '12px auto',
                  cursor: 'pointer'
                }}
                onFocus={(e) => e.target.style.border = '1px solid #ff7f27'}
                onBlur={(e) => e.target.style.border = '1px solid #ddd'}
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
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '14px',
                color: '#555'
              }}>
                Department:
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'border 0.3s ease',
                  outline: 'none',
                  boxSizing: 'border-box',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 15px top 50%',
                  backgroundSize: '12px auto',
                  cursor: 'pointer'
                }}
                onFocus={(e) => e.target.style.border = '1px solid #ff7f27'}
                onBlur={(e) => e.target.style.border = '1px solid #ddd'}
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
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#ff7f27',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 6px rgba(255, 127, 39, 0.2)',
              marginTop: '10px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f94d00';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 8px rgba(255, 127, 39, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ff7f27';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 6px rgba(255, 127, 39, 0.2)';
            }}
          >
            Sign Up
          </button>
        </form>

        <div style={{
          marginTop: '25px',
          textAlign: 'center',
          width: '100%'
        }}>
          <p style={{
            color: '#555',
            fontSize: '14px'
          }}>
            Already have an account?{' '}
            <Link
              to="/signin"
              style={{
                color: '#ff7f27',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#f94d00';
                e.target.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#ff7f27';
                e.target.style.textDecoration = 'none';
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
