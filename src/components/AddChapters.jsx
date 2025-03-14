import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddChapters = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    chapterDetails: '',
    Publisher: '',
    ISBN:'',
    authorPosition:''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/research/addchapters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert("Chapters submitted successfully!");
        setFormData({ chapterDetails: '',
          Publisher: '',
          ISBN:'',
          authorPosition:'' });
        navigate('/chapters');
        
      } else {
        alert("Error submitting Chapter");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Add Chapters</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Chapters Authored</label>
          <textarea
             name="chapterDetails"
             value={formData.chapterDetails}
             onChange={handleChange}
              className="w-full p-2 border rounded-md"
              rows="3"
              required
             ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium">Publisher</label>
          <input
            type="text"
            name="Publisher"
            value={formData.Publisher}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">ISBN</label>
          <input
            type="text"
            name="ISBN"
            value={formData.ISBN}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
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

export default AddChapters
