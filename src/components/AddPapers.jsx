import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';



const AddPapers = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    paperDetails: '',
    authorPosition: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/research/addpapers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert("Papers submitted successfully!");
        setFormData({ paperDetails: '', authorPosition: '' });
        navigate('/papers');
        
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
      <h2 className="text-xl font-semibold mb-4">Add Paper</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Conference Paper Details</label>
          <textarea
            name="paperDetails"
            value={formData.paperDetails}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows="3"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium">Author Position</label>
          <input
            type="text"
            name="authorPosition"
            value={formData.authorPosition}
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

export default AddPapers;
