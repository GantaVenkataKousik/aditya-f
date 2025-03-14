import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddContribution = () => {
  const navigate = useNavigate();
  const [contributionDetails, setContributionDetails] = useState('');
  const [Benefit, setBenefit] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/others/addcontribution', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ contributionDetails, Benefit })
      });
      
      if (response.ok) {
        navigate('/partb');
      } else {
        console.error('Error adding contribution');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Add Contribution</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Contribution Details</label>
          <textarea
            className="w-full p-2 border rounded"
            value={contributionDetails}
            onChange={(e) => setContributionDetails(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Benefit</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={Benefit}
            onChange={(e) => setBenefit(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Contribution'}
        </button>
      </form>
    </div>
  );
};

export default AddContribution;
