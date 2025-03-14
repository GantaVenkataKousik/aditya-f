import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddResponsibility = () => {
  const navigate = useNavigate();
  const [Responsibility, setResponsibility] = useState('');
  const [assignedBy, setAssignedBy] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/others/addresponsibility', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Responsibility, assignedBy })
      });
      
      if (response.ok) {
        navigate('/partb');
      } else {
        console.error('Error adding responsibility');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Add Responsibility</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Responsibility</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={Responsibility}
            onChange={(e) => setResponsibility(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Assigned By</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={assignedBy}
            onChange={(e) => setAssignedBy(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Responsibility'}
        </button>
      </form>
    </div>
  );
};

export default AddResponsibility;