import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const AddResearch = () => {
  const location = useLocation();
  const token = location.state?.token; 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    try {
      const response = await fetch('http://localhost:5000/research/add', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
     console.log("Token at AddResearch:",token);
      if (response.ok) {
        alert('Research added successfully!');
        navigate('/research');
      } else {
        throw new Error('Failed to add research');
      }
    } catch (error) {
      console.log('Error:', error);
      alert('An error occurred while adding research!');
    }

    setFormData({
      title: '',
      description: '',
      date: '',
    });
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1>Add details of Research</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter the title"
            style={inputStyle}
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter the description"
            style={inputStyle}
          />
        </div>
        <div>
          <label>Published Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div>
          <button type="submit" style={buttonStyle}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddResearch;
