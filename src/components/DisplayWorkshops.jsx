import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

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
    const userId = localStorage.getItem('userId');
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://aditya-b.onrender.com/workshop/${userId}/${selectedWorkshop._id}?userId=${userId}`, {
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
      const response = await fetch(`https://aditya-b.onrender.com/workshop/${userId}?userId=${userId}`, {
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
    const userId = localStorage.getItem('userId');
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

      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '20px'
      }}>
        <button
          onClick={handleAddClick}
          className='no-print'
          style={{
            backgroundColor: '#1a4b88',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '10px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '16px',
            fontWeight: '500',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          }}
        >
          <FaPlus /> Add Workshop
        </button>
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
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        <button
                          onClick={() => handleUpdateClick(workshop)}
                          className='no-print'
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px',
                            margin: "2px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            backgroundColor: "#1a4b88",
                            color: "white",
                            transition: "all 0.3s ease",
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            width: "36px",
                            height: "36px"
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e67528"}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1a4b88"}
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(workshop._id)}
                          className='no-print'
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px',
                            margin: "2px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            backgroundColor: "#e74c3c",
                            color: "white",
                            transition: "all 0.3s ease",
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            width: "36px",
                            height: "36px"
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#c0392b"}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#e74c3c"}
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>No workshops found</td>
                </tr>
              )}

              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '1rem', fontWeight: 'bold' }}>
                  Self-Assessment Marks (Max: 20)
                </td>
                <td style={{ padding: '0.5rem', border: '1px solid #000', textAlign: 'center' }}>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={workshopMarks}
                    onChange={(e) => handleMarksUpdate(e.target.value)}
                    style={{
                      width: '60px',
                      textAlign: 'center',
                      padding: '5px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                    readOnly
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {showEditForm && (
            <div className='modal-overlay' style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <div className='update-form' style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                width: '90%',
                maxWidth: '500px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ margin: 0, color: '#333' }}>Update Workshop</h2>
                  <button
                    onClick={() => setShowEditForm(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '20px',
                      cursor: 'pointer',
                      color: '#777'
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleEdit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Workshop Title</label>
                      <input
                        type="text"
                        name="workshopTitle"
                        value={formData.workshopTitle}
                        onChange={handleInputChange}
                        placeholder="Workshop Title"
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Organizer</label>
                      <input
                        type="text"
                        name="organizer"
                        value={formData.organizer}
                        onChange={handleInputChange}
                        placeholder="Organizer"
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Date</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        placeholder="Date"
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Location"
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '15px' }}>
                    <button
                      type='button'
                      onClick={() => setShowEditForm(false)}
                      className='no-print'
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#f5f5f5',
                        color: '#333',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        width: '45%'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='no-print'
                      disabled={isSubmitting}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#1a4b88',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        fontWeight: '500',
                        width: '45%',
                        opacity: isSubmitting ? 0.7 : 1
                      }}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showAddForm && (
            <div className='modal-overlay' style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <div className='add-form' style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                width: '90%',
                maxWidth: '500px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ margin: 0, color: '#333' }}>Add Workshop</h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '20px',
                      cursor: 'pointer',
                      color: '#777'
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleAddFormSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Workshop Title</label>
                      <input
                        type="text"
                        name="workshopTitle"
                        value={formData.workshopTitle}
                        onChange={handleInputChange}
                        placeholder="Workshop Title"
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Organizer</label>
                      <input
                        type="text"
                        name="organizer"
                        value={formData.organizer}
                        onChange={handleInputChange}
                        placeholder="Organizer"
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Date</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        placeholder="Date"
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Location"
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '15px' }}>
                    <button
                      type='button'
                      onClick={() => setShowAddForm(false)}
                      className='no-print'
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#f5f5f5',
                        color: '#333',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        width: '45%'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='no-print'
                      disabled={isSubmitting}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#1a4b88',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        fontWeight: '500',
                        width: '45%',
                        opacity: isSubmitting ? 0.7 : 1
                      }}
                    >
                      {isSubmitting ? 'Adding...' : 'Add Workshop'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DisplayWorkshops;