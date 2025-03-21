import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PatentsGranted = () => {
  const navigate = useNavigate();
  const [patents, setPatents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [formData, setFormData] = useState({
    PTitle: '',
    PNumber: '',
    CountryGranted: '',
    GrantedDate: ''
  });

  const fetchPatents = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://aditya-b.onrender.com/research/pgranted/${userId}`, {
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
        console.error("Error fetching patents");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatents();
  }, []);

  const handleAddClick = () => {
    setFormData({
      PTitle: '',
      PNumber: '',
      CountryGranted: '',
      GrantedDate: ''
    });
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const handleUpdateClick = (patent, index) => {
    setShowEditForm(true);
    setShowAddForm(false);
    setSelectedPatent({ ...patent, index });
    setFormData({
      ...patent,
      GrantedDate: formatDate(patent.GrantedDate)
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');

      const submissionData = {
        ...formData,
        GrantedDate: new Date(formData.GrantedDate).toISOString()
      };

      const response = await fetch(`https://aditya-b.onrender.com/research/pgranted/${userId}/${selectedPatent.index}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        toast.success("Patent updated successfully!");
        setShowEditForm(false);
        setPatents(prevPatents => {
          const newPatents = [...prevPatents];
          newPatents[selectedPatent.index] = submissionData;
          return newPatents;
        });
        await fetchPatents();
      } else {
        toast.error("Error updating patent");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update patent");
    }
  };

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      const submissionData = {
        ...formData,
        GrantedDate: new Date(formData.GrantedDate).toISOString()
      };

      const response = await fetch(`https://aditya-b.onrender.com/research/pgranted/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        toast.success("Patent added successfully!");
        setShowAddForm(false);
        setPatents(prevPatents => [...prevPatents, submissionData]);
        await fetchPatents();
      } else {
        toast.error("Error adding patent");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add patent");
    }
  };

  const handleDelete = async (index) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://aditya-b.onrender.com/research/pgranted/${userId}/${index}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success("Patent deleted successfully!");
        fetchPatents();
      } else {
        console.error("Error deleting patent");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toISOString().split('T')[0];
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('en-GB');
  };

  const renderPatentRow = (patent, index) => (
    <tr key={index} style={{ textAlign: 'center' }}>
      <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{index + 1}</td>
      <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{patent.PTitle || '-'}</td>
      <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{patent.PNumber || '-'}</td>
      <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{patent.CountryGranted || '-'}</td>
      <td style={{ padding: '0.5rem', border: '1px solid #000' }}>
        {formatDateForDisplay(patent.GrantedDate)}
      </td>
      <td style={{ padding: '0.5rem', border: '1px solid #000' }}>
        <button onClick={() => handleUpdateClick(patent, index)} style={{ marginRight: '5px' }}>Edit</button>
        <button onClick={() => handleDelete(index)}>Delete</button>
      </td>
    </tr>
  );

  return (
    <div style={{ padding: '15px' }}>
      <ToastContainer />
      <div style={{ width: '90px', marginLeft: '1100px' }}>
        <button onClick={handleAddClick}> + Add</button>
      </div>
      <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '1rem' }}>
        Patents Granted:
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
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Country Granted</th>
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Granted Date</th>
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patents.length > 0 ? (
                patents.map((patent, index) => renderPatentRow(patent, index))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>
                    No patents granted found
                  </td>
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
                <input type="text" name="CountryGranted" value={formData.CountryGranted} onChange={handleInputChange} placeholder="Country Granted" required />
                <input type="date" name="GrantedDate" value={formData.GrantedDate} onChange={handleInputChange} placeholder="Granted Date" required />
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
                <input type="text" name="CountryGranted" value={formData.CountryGranted} onChange={handleInputChange} placeholder="Country Granted" required />
                <input type="date" name="GrantedDate" value={formData.GrantedDate} onChange={handleInputChange} placeholder="Granted Date" required />
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

export default PatentsGranted;
