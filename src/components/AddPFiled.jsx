import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddPFiled = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    PTitle: '',
    PNumber: '',
    FiledinCountry:'',
    PublishedDate:''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/research/addpfiled', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert("Patents Filed submitted successfully!");
        setFormData({  PTitle: '',
          PNumber: '',
          FiledinCountry:'',
          PublishedDate:'' });
        navigate('/patentsfiled');
        
      } else {
        alert("Error submitting article");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Add Patents Filed</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Patent Title</label>
          <textarea
            name="PTitle"
            value={formData.PTitle}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows="3"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium">Patent Number</label>
          <input
            type="text"
            name="PNumber"
            value={formData.PNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Filed in Country</label>
          <input
            type="text"
            name="FiledinCountry"
            value={formData.FiledinCountry}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
  <label className="block text-sm font-medium">Published Date  :  </label>
  <input
    type="date" // Changed from text to date input
    name="PublishedDate"
    value={formData.PublishedDate}
    onChange={handleChange}
    className="w-full p-2 border rounded-md"
    required
  />
</div>


        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddPFiled
