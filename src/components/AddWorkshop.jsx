import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddWorkshop.css';

const AddWorkshop = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    Description: '',
    Category: '',
    Date: '',
    StartTime: '',
    EndTime: '',
    Venue: '',
    Mode: '',
    OrganizedBy:'',
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
    try {
      const token = localStorage.getItem('token');
      console.log(token);
      const response = await fetch('http://localhost:5000/workshop/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      console.log(token);
      if (response.ok) {
        alert('Workshop added successfully!');
        navigate('/partb');
      } else {
        const error = await response.json();
        console.error('Error adding workshop:', error);
        alert(error.message || 'Failed to add workshop');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the workshop!');
    }
  };

  return (
    <div className="form-container">
      <h1>Add Workshop</h1>
      <form onSubmit={handleSubmit} className="workshop-form">
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            name="Category"
            value={formData.Category}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="Date"
            value={formData.Date}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Start Time:</label>
          <input
            type="time"
            name="StartTime"
            value={formData.StartTime}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>End Time:</label>
          <input
            type="time"
            name="EndTime"
            value={formData.EndTime}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Venue:</label>
          <input
            type="text"
            name="Venue"
            value={formData.Venue}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Mode:</label>
          <select
            name="Mode"
            value={formData.Mode}
            onChange={handleChange}
            required
            className="input-field"
          >
            <option value="">Select Mode</option>
            <option value="Offline">Offline</option>
            <option value="Online">Online</option>
          </select>
        </div>
        <div className="form-group">
          <label>Organized By:</label>
          <input
            type="text"
            name="OrganizedBy"
            value={formData.OrganizedBy}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <button type="submit" className="submit-btn">Add Workshop</button>
      </form>
    </div>
  );
};


export default AddWorkshop;
