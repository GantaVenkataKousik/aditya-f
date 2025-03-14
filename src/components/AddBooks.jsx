import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddBooks = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bookDetails: '',
    ISBN: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/research/addbooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert("Books submitted successfully!");
        setFormData({ bookDetails: '', ISBN: '' });
        navigate('/books');
        
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
      <h2 className="text-xl font-semibold mb-4">Add Books</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Books Authored</label>
          <textarea
            name="bookDetails"
            value={formData.bookDetails}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows="3"
            required
          ></textarea>
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

export default AddBooks
