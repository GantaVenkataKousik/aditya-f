import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AddResponsibility = () => {
  const navigate = useNavigate();
  const [Responsibility, setResponsibility] = useState('');
  const [AssignedBy, setAssignedBy] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://aditya-b.onrender.com/others/add-responsibility/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Responsibility, AssignedBy })
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Responsibility added successfully!");
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
    <div className="add-article-container">
      <ToastContainer />
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
            value={AssignedBy}
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