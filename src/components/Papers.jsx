import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Papers = () => {
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [formData, setFormData] = useState({
    paperDetails: '',
    authorPosition: ''
  });

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const response = await fetch(`https://aditya-b.onrender.com/research/papers/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setPapers(data);
        } else {
          console.error("Error fetching papers");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  const handleAddClick = () => {
    setFormData({
      paperDetails: '',
      authorPosition: ''
    });
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const handleUpdateClick = (paper, index) => {
    setShowEditForm(true);
    setShowAddForm(false);
    setSelectedPaper({ ...paper, index });
    setFormData(paper);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://aditya-b.onrender.com/research/papers/${userId}/${selectedPaper.index}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Paper updated successfully!");
        setShowEditForm(false);
        fetchPapers();
      } else {
        console.error("Error updating paper");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://aditya-b.onrender.com/research/papers/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Paper added successfully!");
        setShowAddForm(false);
        fetchPapers();
      } else {
        console.error("Error adding paper");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (index) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://aditya-b.onrender.com/research/papers/${userId}/${index}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert("Paper deleted successfully!");
        fetchPapers();
      } else {
        console.error("Error deleting paper");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ padding: '15px' }}>
      <div style={{ width: '90px', marginLeft: '1100px' }}>
        <button onClick={handleAddClick}> + Add</button>
      </div>
      <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '1rem' }}>
        d) Research-Others
      </h3>
      <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '1rem' }}>
        Conference Papers:
      </h3>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '1rem',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#d0e8f2', fontWeight: 'bold' }}>
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>S.No</th>
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Paper details in IEEE format</th>
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Author Position</th>
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {papers.length > 0 ? (
                papers.map((paper, index) => (
                  <tr key={index} style={{ textAlign: 'center' }}>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{index + 1}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{paper.paperDetails || '-'}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{paper.authorPosition || '-'}</td>
                    <td style={{ display: 'flex', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleUpdateClick(paper, index)} style={{ width: 'auto' }}>
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(index)} style={{ width: 'auto', backgroundColor: 'red', color: 'white' }}>
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>No papers found</td>
                </tr>
              )}
            </tbody>
          </table>
          {showEditForm && (
            <div className="update-form">
              <h2>Update Paper</h2>
              <form onSubmit={handleEdit}>
                <input type="text" name="paperDetails" value={formData.paperDetails} onChange={handleInputChange} placeholder="Paper Details" required />
                <input type="text" name="authorPosition" value={formData.authorPosition} onChange={handleInputChange} placeholder="Author Position" required />
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setShowEditForm(false)}>Cancel</button>
              </form>
            </div>
          )}
          {showAddForm && (
            <div className="add-form">
              <h2>Add Paper</h2>
              <form onSubmit={handleAddFormSubmit}>
                <input type="text" name="paperDetails" value={formData.paperDetails} onChange={handleInputChange} placeholder="Paper Details" required />
                <input type="text" name="authorPosition" value={formData.authorPosition} onChange={handleInputChange} placeholder="Author Position" required />
                <button type="submit">Add Paper</button>
                <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Papers;
