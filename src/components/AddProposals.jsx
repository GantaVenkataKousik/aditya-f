import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';



const AddProposals = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    proposalDetails: '',
    fundingAgency: '',
    amount: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/research/addproposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert("Proposals submitted successfully!");
        setFormData({ proposalDetails: '', fundingAgency: '', amount: '' });
        navigate('/proposals');
        
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
      <h2 className="text-xl font-semibold mb-4">Add Proposal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Proposal Details</label>
          <textarea
            name="proposalDetails"
            value={formData.proposalDetails}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows="3"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium">Funding Agency</label>
          <input
            type="text"
            name="fundingAgency"
            value={formData.fundingAgency}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
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
};

export default AddProposals;

