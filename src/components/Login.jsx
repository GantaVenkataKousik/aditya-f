import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('role', data.role);
        localStorage.setItem('outreachmarks', data.assesmentMarks.OutreachSelfAssesMarks);
        localStorage.setItem('specialmarks', data.assesmentMarks.SpecialSelfAssesMarks);
        localStorage.setItem('additionalmarks', data.assesmentMarks.AddSelfAssesMarks);
        localStorage.setItem('researchmarks', data.assesmentMarks.ResearchSelfAssesMarks);
        localStorage.setItem('workmarks', data.assesmentMarks.WorkSelfAssesMarks);
        localStorage.setItem('proposlmarks', data.assesmentMarks.ProposalMarks);
        localStorage.setItem('scimarks', data.assesmentMarks.SciMarks);
        localStorage.setItem('wosmarks', data.assesmentMarks.WosMarks);
        localStorage.setItem('couavgpermarks', data.assesmentMarks.CouAvgPerMarks);
        localStorage.setItem('coufeedmarks', data.assesmentMarks.CoufeedMarks);
        localStorage.setItem('proctormarks', data.assesmentMarks.ProctoringMarks);
        toast.success('Login successful');
        navigate("/home");
      }
      else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('fetching failed', error.message);
      toast.error(error.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '20px'
      }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #eaeaea',
            borderRadius: '12px',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
            padding: '30px',
            backgroundColor: '#ffffff',
            width: '100%',
            maxWidth: '450px',
            transition: 'all 0.3s ease'
          }}
        >
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#ff7f27',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="40px" height="40px">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>

          <h2
            style={{
              marginBottom: '30px',
              color: '#333',
              fontFamily: 'Arial, sans-serif',
              fontWeight: '600',
              fontSize: '24px'
            }}
          >
            Sign In
          </h2>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#555'
                }}
              >
                Email Address
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
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label
                htmlFor="password"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#555'
                }}
              >
                Password
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
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#ff7f27',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px rgba(255, 127, 39, 0.2)'
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
              Sign In
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
              Don't have an account?{' '}
              <Link
                to="/signup"
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
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;