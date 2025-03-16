import React, { useEffect, useState } from 'react';
import './DisplayWorkshops.css';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';

const DisplayWorkshops = ({ data: propsData }) => {
  const [workshops, setWorkshops] = useState(propsData?.workshops || []);
  const [totalMarks, setTotalMarks] = useState(propsData?.totalMarks || 0);
  const [loading, setLoading] = useState(!propsData);
  const navigate = useNavigate();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    Description: '',
    Category: '',
    Date: '',
    Venue: '',
    OrganizedBy: '',
  });

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return "-";
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    const start = new Date();
    start.setHours(startHours, startMinutes, 0);
    const end = new Date();
    end.setHours(endHours, endMinutes, 0);
    let diff = (end - start) / (1000 * 60);
    if (diff < 0) diff += 24 * 60;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}h ${minutes}m`;
  };

  const fetchWorkshops = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://aditya-b.onrender.com/workshop/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        setWorkshops(data.Workshops);
        setTotalMarks(data.TotalMarks);
      } else {
        console.error('Failed to fetch workshops:', data.message);
      }
    } catch (error) {
      console.error('Error fetching workshops:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!propsData) {
      fetchWorkshops();
    }
  }, [propsData]);

  const handleUpdateClick = (workshop) => {
    setShowEditForm(true);
    setShowAddForm(false);
    setSelectedWorkshop(workshop);
    setFormData(workshop);
  };

  const handleAddClick = () => {
    setFormData({
      title: '',
      Description: '',
      Category: '',
      Date: '',
      Venue: '',
      OrganizedBy: '',
    });
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const response = await fetch(`https://aditya-b.onrender.com/workshop/${selectedWorkshop._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (data.success) {
      toast.success('Workshop updated successfully');
      setShowEditForm(false);
      fetchWorkshops();
    } else {
      toast.error('Failed to update workshop');
    }
  };

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch(`https://aditya-b.onrender.com/workshop/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newWorkshop = await response.json();
        setWorkshops([...workshops, newWorkshop]);
        setShowAddForm(false); // Close the form after successful addition
        fetchWorkshops();
        toast.success('Workshop added successfully');
      } else {
        toast.error('Failed to add workshop');
      }
    } catch (error) {
      console.error('Error adding workshop:', error);
      toast.error('Failed to add workshop');
    }
  };

  const handleDelete = async (id) => {
    const response = await fetch(`https://aditya-b.onrender.com/workshop/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (data.success) {
      toast.success('Workshop deleted successfully');
      fetchWorkshops();
    } else {
      toast.error('Failed to delete workshop');
    }
  };

  return (
    <div className="workshops-container">
      <ToastContainer />
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-base">5. Workshops/FDPs/STTP/Refresher Courses Attended:</h2>
        <div className="flex items-center gap-2">
          <input type="file" style={{ border: '1px solid #ccc', padding: '5px', borderRadius: '8px' }} />
          {/* <button className="p-1 bg-blue-500 text-white rounded text-sm w-24 h-8 no-print" onClick={handleUpload}>Upload</button> */}
          <button className="p-1 bg-blue-500 text-white rounded text-sm w-24 h-8 no-print" onClick={handleAddClick}>+ Add</button>
        </div>
      </div>

      {loading ? (
        <p>Loading workshops...</p>
      ) : (
        <div className="workshop-table-container">
          <table className="workshop-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Program</th>
                <th>Description</th>
                <th>Category</th>
                <th>Date & Place</th>
                <th>Organized by</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workshops.length > 0 ? (
                workshops.map((workshop, index) => (
                  <tr key={workshop._id}>
                    <td>{index + 1}</td>
                    <td>{workshop.title || '-'}</td>
                    <td>{workshop.Description || '-'}</td>
                    <td>{workshop.Category || '-'}</td>
                    <td>
                      {new Date(workshop.Date).toLocaleDateString()} <br />
                      {workshop.Venue || '-'}
                    </td>
                    <td>{workshop.OrganizedBy || '-'}</td>
                    <td style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      <button onClick={() => handleUpdateClick(workshop)} className="p-1 bg-blue-500 text-white rounded text-m  w-auto no-print"><FaEdit /></button>
                      <button onClick={() => handleDelete(workshop._id)} className="p-1 bg-red-500 text-white rounded text-m w-auto no-print "><FaTrash /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">No workshops available</td>
                </tr>
              )}
              {/* Self-Assessment Marks row */}
              <tr>
                <td colSpan="5" className="text-right font-bold">Self-Assessment Marks (Max: 20):</td>
                <td className="font-bold">{totalMarks}</td>
              </tr>
            </tbody>
          </table>
          {showEditForm && (
            <div className="update-form">
              <h2>Update Workshop</h2>
              <form onSubmit={handleEdit}>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Title" />
                <input type="text" name="Description" value={formData.Description} onChange={handleInputChange} placeholder="Description" />
                <input type="text" name="Category" value={formData.Category} onChange={handleInputChange} placeholder="Category" />
                <input type="date" name="Date" value={formData.Date} onChange={handleInputChange} placeholder="Date" />
                <input type="text" name="Venue" value={formData.Venue} onChange={handleInputChange} placeholder="Venue" />
                <input type="text" name="OrganizedBy" value={formData.OrganizedBy} onChange={handleInputChange} placeholder="Organized By" />
                <button className='no-print' type="submit">Save Changes</button>
                <button className='no-print' type="button" onClick={() => setShowEditForm(false)}>Cancel</button>
              </form>
            </div>
          )}
          {showAddForm && (
            <div className="add-form">
              <h2>Add Workshop</h2>
              <form onSubmit={handleAddFormSubmit}>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Title" />
                <input type="text" name="Description" value={formData.Description} onChange={handleInputChange} placeholder="Description" />
                <input type="text" name="Category" value={formData.Category} onChange={handleInputChange} placeholder="Category" />
                <input type="date" name="Date" value={formData.Date} onChange={handleInputChange} placeholder="Date" />
                <input type="text" name="Venue" value={formData.Venue} onChange={handleInputChange} placeholder="Venue" />
                <input type="text" name="OrganizedBy" value={formData.OrganizedBy} onChange={handleInputChange} placeholder="Organized By" />
                <button className='no-print' type="submit">Add Workshop</button>
                <button className='no-print' type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DisplayWorkshops;
