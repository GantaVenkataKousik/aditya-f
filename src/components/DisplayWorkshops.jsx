import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const DisplayWorkshops = ({ workshopsData }) => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [formData, setFormData] = useState({
    workshopTitle: '',
    organizer: '',
    date: '',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workshopMarks, setWorkshopMarks] = useState(10);

  const fetchWorkshops = async () => {
    try {
      const userId = localStorage.getItem('userId');

      const response = await fetch(`https://aditya-b.onrender.com/workshop/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const res = await response.json();
      if (res.success) {
        setWorkshops(res.Workshops);
        const marks = res.Workshops.length > 0 ? 20 : 0;
        setWorkshopMarks(marks);
        localStorage.setItem('workshopmarks', marks);
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

  const validateMarks = (marks) => {
    const numMarks = Number(marks);
    return Math.min(10, Math.max(0, numMarks));
  };

  useEffect(() => {
    const marks = validateMarks(localStorage.getItem('workshopmarks') || 0);
    localStorage.setItem('workshopmarks', marks);
    if (workshopsData) {
      setWorkshops(workshopsData);
    } else {
      fetchWorkshops();
    }
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
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
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
        setWorkshopMarks(10);
        localStorage.setItem('workshopmarks', 10);
        fetchWorkshops();
      } else {
        toast.error("Error adding workshop");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error adding workshop");
    } finally {
      setIsSubmitting(false);
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
        const remainingWorkshops = workshops.filter(w => w._id !== workshopId);
        const newMarks = remainingWorkshops.length > 0 ? 10 : 0;
        setWorkshopMarks(newMarks);
        localStorage.setItem('workshopmarks', newMarks);
        fetchWorkshops();
      } else {
        toast.error("Error deleting workshop");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error deleting workshop");
    }
  };

  const handleMarksUpdate = async (value) => {
    const validatedMarks = validateMarks(value);
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://aditya-b.onrender.com/update-marks/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          markType: 'workshop',
          value: validatedMarks
        })
      });

      if (response.ok) {
        localStorage.setItem('workshopmarks', validatedMarks);
        setWorkshopMarks(validatedMarks);
        toast.success('Marks updated successfully');
      } else {
        toast.error('Failed to update marks');
      }
    } catch (error) {
      console.error('Error updating marks:', error);
      toast.error('Error updating marks');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date)) return '-';

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '-';
    }
  };

  return (
    <div style={{ padding: '15px' }}>
      <ToastContainer />
      <div style={{ width: '90px', marginLeft: '1100px' }}>

        <button onClick={handleAddClick} className='no-print'> + Add</button>

      </div>
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

                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Actions</th>

              </tr>
            </thead>
            <tbody>
              {workshops.length > 0 ? (
                workshops.map((workshop, index) => (
                  <tr key={workshop._id || index} style={{ textAlign: 'center' }}>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{index + 1}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{workshop.workshopTitle || '-'}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{workshop.organizer || '-'}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{formatDate(workshop.date)}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{workshop.location || '-'}</td>
                    <td style={{ display: 'flex', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleUpdateClick(workshop)} style={{ width: 'auto' }} className='no-print'>
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(workshop._id)} style={{ width: 'auto', backgroundColor: 'red', color: 'white' }} className='no-print'>
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>No workshops found</td>
                </tr>
              )}

              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '1rem', fontWeight: 'bold' }}>
                  Self-Assessment Marks (Max: 20)
                </td>
                <td style={{ padding: '0.5rem', border: '1px solid #000' }}>

                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={workshopMarks}
                    onChange={(e) => handleMarksUpdate(e.target.value)}
                    className="w-16 text-center"
                    readOnly
                  />

                </td>
              </tr>
            </tbody>
          </table>
          {(
            <>
              {showEditForm && (
                <div className="update-form">
                  <h2>Update Workshop</h2>
                  <form onSubmit={handleEdit}>
                    <input type="text" name="workshopTitle" value={formData.workshopTitle} onChange={handleInputChange} placeholder="Workshop Title" required />
                    <input type="text" name="organizer" value={formData.organizer} onChange={handleInputChange} placeholder="Organizer" required />
                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} placeholder="Date" required />
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Location" required />
                    <button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
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
                    <button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Adding...' : 'Add Workshop'}
                    </button>
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