import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Chapters = () => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [formData, setFormData] = useState({
    chapterDetails: '',
    Publisher: '',
    ISBN: '',
    authorPosition: ''
  });

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const response = await fetch(`https://aditya-b.onrender.com/research/chapters/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setChapters(data);
        } else {
          console.error("Error fetching chapters");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, []);

  const handleAddClick = () => {
    setFormData({
      chapterDetails: '',
      Publisher: '',
      ISBN: '',
      authorPosition: ''
    });
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const handleUpdateClick = (chapter, index) => {
    setShowEditForm(true);
    setShowAddForm(false);
    setSelectedChapter({ ...chapter, index });
    setFormData(chapter);
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
      const response = await fetch(`https://aditya-b.onrender.com/research/chapters/${userId}/${selectedChapter.index}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Chapter updated successfully!");
        setShowEditForm(false);
        fetchChapters();
      } else {
        console.error("Error updating chapter");
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
      const response = await fetch(`https://aditya-b.onrender.com/research/chapters/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Chapter added successfully!");
        setShowAddForm(false);
        fetchChapters();
      } else {
        console.error("Error adding chapter");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (index) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://aditya-b.onrender.com/research/chapters/${userId}/${index}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert("Chapter deleted successfully!");
        fetchChapters();
      } else {
        console.error("Error deleting chapter");
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
        Book Chapters Authored:
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
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Chapter details in IEEE format</th>
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Publisher</th>
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>ISSN/ISBN No.</th>
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Author Position</th>
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {chapters.length > 0 ? (
                chapters.map((chapter, index) => (
                  <tr key={index} style={{ textAlign: 'center' }}>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{index + 1}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{chapter.chapterDetails || '-'}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{chapter.Publisher || '-'}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{chapter.ISBN || '-'}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{chapter.authorPosition || '-'}</td>
                    <td style={{ display: 'flex', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleUpdateClick(chapter, index)} style={{ width: 'auto' }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(index)} style={{ width: 'auto', backgroundColor: 'red', color: 'white' }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>No chapters found</td>
                </tr>
              )}
            </tbody>
          </table>
          {showEditForm && (
            <div className="update-form">
              <h2>Update Chapter</h2>
              <form onSubmit={handleEdit}>
                <input type="text" name="chapterDetails" value={formData.chapterDetails} onChange={handleInputChange} placeholder="Chapter Details" required />
                <input type="text" name="Publisher" value={formData.Publisher} onChange={handleInputChange} placeholder="Publisher" required />
                <input type="text" name="ISBN" value={formData.ISBN} onChange={handleInputChange} placeholder="ISBN" required />
                <input type="text" name="authorPosition" value={formData.authorPosition} onChange={handleInputChange} placeholder="Author Position" required />
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setShowEditForm(false)}>Cancel</button>
              </form>
            </div>
          )}
          {showAddForm && (
            <div className="add-form">
              <h2>Add Chapter</h2>
              <form onSubmit={handleAddFormSubmit}>
                <input type="text" name="chapterDetails" value={formData.chapterDetails} onChange={handleInputChange} placeholder="Chapter Details" required />
                <input type="text" name="Publisher" value={formData.Publisher} onChange={handleInputChange} placeholder="Publisher" required />
                <input type="text" name="ISBN" value={formData.ISBN} onChange={handleInputChange} placeholder="ISBN" required />
                <input type="text" name="authorPosition" value={formData.authorPosition} onChange={handleInputChange} placeholder="Author Position" required />
                <button type="submit">Add Chapter</button>
                <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chapters;
