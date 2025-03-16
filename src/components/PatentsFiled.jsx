import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PatentsFiled = () => {
  const navigate = useNavigate();
  const [patents, setPatents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [formData, setFormData] = useState({
    PTitle: '',
    PNumber: '',
    FiledinCountry: '',
    PublishedDate: ''
  });
  const fetchPatentsFiled = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://aditya-b.onrender.com/research/pfiled/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPatents(data);
      } else {
        console.error("Error fetching filed patents");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {


    fetchPatentsFiled();
  }, []);

  const handleAddClick = () => {
    setFormData({
      PTitle: '',
      PNumber: '',
      FiledinCountry: '',
      PublishedDate: ''
    });
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const handleUpdateClick = (patent, index) => {
    setShowEditForm(true);
    setShowAddForm(false);
    setSelectedPatent({ ...patent, index });
    setFormData(patent);
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
      const response = await fetch(`https://aditya-b.onrender.com/research/pfiled/${userId}/${selectedPatent.index}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success("Patent updated successfully!");
        setShowEditForm(false);
        fetchPatentsFiled();
      } else {
        console.error("Error updating patent");
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
      const response = await fetch(`https://aditya-b.onrender.com/research/pfiled/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success("Patent added successfully!");
        setShowAddForm(false);
        fetchPatentsFiled();
      } else {
        console.error("Error adding patent");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (index) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://aditya-b.onrender.com/research/pfiled/${userId}/${index}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success("Patent deleted successfully!");
        fetchPatentsFiled();
      } else {
        console.error("Error deleting patent");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ padding: '15px' }}>
      <ToastContainer />
      <div style={{ width: '90px', marginLeft: '1100px' }}>
        <button onClick={handleAddClick}> + Add</button>
      </div>
      <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '1rem' }}>
        Patents Filed:
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
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Patent Title</th>
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Patent Number</th>
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Filed in Country</th>
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Published Date</th>
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patents.length > 0 ? (
                patents.map((patent, index) => (
                  <tr key={index} style={{ textAlign: 'center' }}>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{index + 1}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{patent.PTitle || '-'}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{patent.PNumber || '-'}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{patent.FiledinCountry || '-'}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{patent.PublishedDate || '-'}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>
                      <button onClick={() => handleUpdateClick(patent, index)} style={{ marginRight: '5px' }}>Edit</button>
                      <button onClick={() => handleDelete(index)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>No patents filed found</td>
                </tr>
              )}
            </tbody>
          </table>
          {showEditForm && (
            <div className="update-form">
              <h2>Update Patent</h2>
              <form onSubmit={handleEdit}>
                <input type="text" name="PTitle" value={formData.PTitle} onChange={handleInputChange} placeholder="Patent Title" required />
                <input type="text" name="PNumber" value={formData.PNumber} onChange={handleInputChange} placeholder="Patent Number" required />
                <input type="text" name="FiledinCountry" value={formData.FiledinCountry} onChange={handleInputChange} placeholder="Filed in Country" required />
                <input type="date" name="PublishedDate" value={formData.PublishedDate} onChange={handleInputChange} placeholder="Published Date" required />
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setShowEditForm(false)}>Cancel</button>
              </form>
            </div>
          )}
          {showAddForm && (
            <div className="add-form">
              <h2>Add Patent</h2>
              <form onSubmit={handleAddFormSubmit}>
                <input type="text" name="PTitle" value={formData.PTitle} onChange={handleInputChange} placeholder="Patent Title" required />
                <input type="text" name="PNumber" value={formData.PNumber} onChange={handleInputChange} placeholder="Patent Number" required />
                <input type="text" name="FiledinCountry" value={formData.FiledinCountry} onChange={handleInputChange} placeholder="Filed in Country" required />
                <input type="date" name="PublishedDate" value={formData.PublishedDate} onChange={handleInputChange} placeholder="Published Date" required />
                <button type="submit">Add Patent</button>
                <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatentsFiled;
