import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { canEditDelete, isHODorDean } from '../utils/permissions';

const DisplayWorkshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [canModify, setCanModify] = useState(false);
  const [formData, setFormData] = useState({
    workshopTitle: '',
    organizer: '',
    date: '',
    location: ''
  });
  const [isHODDeanView, setIsHODDeanView] = useState(false);

  const fetchWorkshops = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      const endpoint = isHODDeanView
        ? `https://aditya-b.onrender.com/workshop/all`
        : `https://aditya-b.onrender.com/workshop/${userId}`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const res = await response.json();
      if (res.success) {
        setWorkshops(res.Workshops);
      } else {
        toast.error("Error fetching workshops");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error fetching workshops");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'Admin' || role === 'Faculty') {
      setCanModify(true);
    }
    setIsHODDeanView(isHODorDean());
    fetchWorkshops();
  }, []);

  const handleAddClick = () => {
    setFormData({
      workshopTitle: '',
      organizer: '',
      date: '',
      location: ''
    });
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const handleUpdateClick = (workshop) => {
    setShowEditForm(true);
    setShowAddForm(false);
    setSelectedWorkshop(workshop);
    setFormData(workshop);
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
      const response = await fetch(`https://aditya-b.onrender.com/workshop/${userId}/${selectedWorkshop._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const res = await response.json();
      if (res.success) {
        toast.success("Workshop updated successfully!");
        setShowEditForm(false);
        fetchWorkshops();
      } else {
        toast.error("Error updating workshop");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error updating workshop");
    }
  };

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://aditya-b.onrender.com/workshop/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const res = await response.json();
      if (res.success) {
        toast.success("Workshop added successfully!");
        setShowAddForm(false);
        fetchWorkshops();
      } else {
        toast.error("Error adding workshop");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error adding workshop");
    }
  };

  const handleDelete = async (workshopId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://aditya-b.onrender.com/workshop/${userId}/${workshopId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const res = await response.json();
      if (res.success) {
        toast.success("Workshop deleted successfully!");
        fetchWorkshops();
      } else {
        toast.error("Error deleting workshop");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error deleting workshop");
    }
  };

  return (
    <div style={{ padding: '15px' }}>
      <ToastContainer />
      {canModify && (
        <div style={{ width: '90px', marginLeft: '1100px' }}>
          <button onClick={handleAddClick}> + Add</button>
        </div>
      )}
      <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '1rem' }}>
        5. Workshops:
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
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Workshop Title</th>
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Organizer</th>
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Date</th>
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Location</th>
                {canModify && (
                  <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {workshops.length > 0 ? (
                workshops.map((workshop, index) => (
                  <tr key={workshop._id || index} style={{ textAlign: 'center' }}>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{index + 1}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{workshop.workshopTitle || '-'}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{workshop.organizer || '-'}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{workshop.date || '-'}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{workshop.location || '-'}</td>
                    {canModify && (
                      <td style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => handleUpdateClick(workshop)} style={{ width: 'auto' }}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(workshop._id)} style={{ width: 'auto', backgroundColor: 'red', color: 'white' }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={canModify ? "6" : "5"} style={{ textAlign: 'center', padding: '1rem' }}>No workshops found</td>
                </tr>
              )}
            </tbody>
          </table>
          {canModify && (
            <>
              {showEditForm && (
                <div className="update-form">
                  <h2>Update Workshop</h2>
                  <form onSubmit={handleEdit}>
                    <input type="text" name="workshopTitle" value={formData.workshopTitle} onChange={handleInputChange} placeholder="Workshop Title" required />
                    <input type="text" name="organizer" value={formData.organizer} onChange={handleInputChange} placeholder="Organizer" required />
                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} placeholder="Date" required />
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Location" required />
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => setShowEditForm(false)}>Cancel</button>
                  </form>
                </div>
              )}
              {showAddForm && (
                <div className="add-form">
                  <h2>Add Workshop</h2>
                  <form onSubmit={handleAddFormSubmit}>
                    <input type="text" name="workshopTitle" value={formData.workshopTitle} onChange={handleInputChange} placeholder="Workshop Title" required />
                    <input type="text" name="organizer" value={formData.organizer} onChange={handleInputChange} placeholder="Organizer" required />
                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} placeholder="Date" required />
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Location" required />
                    <button type="submit">Add Workshop</button>
                    <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DisplayWorkshops;