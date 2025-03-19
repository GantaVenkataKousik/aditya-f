import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddAward = () => {
  const navigate = useNavigate();
  const [Award, setAward] = useState('');
  const [AwardedBy, setAwardedBy] = useState('');
  const [Level, setLevel] = useState('');
  const [Description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://aditya-b.onrender.com/add-award/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ awardName: Award, awardedBy: AwardedBy, level: Level, description: Description })
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
          <label className="block text-sm font-medium">Awarded By</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={AwardedBy}
            onChange={(e) => setAwardedBy(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Level</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={Level}
            onChange={(e) => setLevel(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={Description}
            onChange={(e) => setDescription(e.target.value)}
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
