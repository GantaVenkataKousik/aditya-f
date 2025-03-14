import React, { useState, useEffect } from 'react';
import './Accept.css'; 
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const Accept = () => {
  const [unapproved, setUnapproved] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/research/process', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUnapproved(data);
        } else {
          console.error('Failed to fetch user:', response.statusText);
        }
      } catch (error) {
        console.error('Error occurred:', error);
      }
    };
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/research/approve/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log(`Approved research ID: ${id}`);
       
        setUnapproved((prev) => prev.filter((item) => item._id !== id));
      } else {
        console.error('Failed to approve research:', response.statusText);
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/research/reject/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        console.log(`Rejected research ID: ${id}`);
      
        setUnapproved((prev) => prev.filter((item) => item._id !== id));
      } else {
        console.error('Failed to approve research:', response.statusText);
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  return (
    <div className="accept-container">
      <div style={{ position: 'fixed', top: 0, width: '99%' }}>
        <Navbar />
      </div>
      <div style={{ paddingTop: '85px' }}>
        <h1 className="title">Unapproved Researches</h1>
        {unapproved.length > 0 ? (
          <div className="research-list">
            {unapproved.map((item) => (
              <div key={item._id} className="research-item">
                <h2 className="research-title" onClick={() => navigate(`/researchtext/${item._id}`)}>{item.title}</h2>
                <p className="research-description">{item.description}</p>
                <div className="button-group">
                  <button
                    className="approve-button"
                    onClick={() => handleApprove(item._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-button"
                    onClick={() => handleReject(item._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-research">No unapproved researches found.</p>
        )}
      </div>
    </div>
  );
};

export default Accept;
