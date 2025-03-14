import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddAward = () => {
  const navigate = useNavigate();
  const [Award, setAward] = useState('');
  const [IssuingOrg, setIssuingOrg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/others/addaward', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Award, IssuingOrg })
      });
      
      if (response.ok) {
        navigate('/partb');
      } else {
        console.error('Error adding award');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Add Award</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Award</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={Award}
            onChange={(e) => setAward(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Issuing Organization</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={IssuingOrg}
            onChange={(e) => setIssuingOrg(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Award'}
        </button>
      </form>
    </div>
  );
};

export default AddAward;
