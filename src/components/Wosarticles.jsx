import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
const WosArticles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [wosMarks, setWosMarks] = useState(0);
  const [formData, setFormData] = useState({
    articleDetails: '',
    ISSN: '',
    authorPosition: ''
  });
  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      const response = await fetch(`https://aditya-b.onrender.com/research/wosarticles/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      } else {
        toast.error("Failed to fetch articles");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error fetching articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
    const wosMarks = localStorage.getItem('wosmarks');
    setWosMarks(wosMarks);
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    toast.success("File uploaded successfully!");

  };

  const handleAddClick = () => {
    setFormData({
      articleDetails: '',
      ISSN: '',
      authorPosition: ''
    });
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const handleUpdateClick = (article) => {
    setShowEditForm(true);
    setShowAddForm(false);
    setSelectedArticle(article);
    setFormData(article);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://aditya-b.onrender.com/research/wosarticles/${userId}/${selectedArticle._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast.success("Article updated successfully!");
        fetchArticles();
        setShowEditForm(false);
      } else {
        alert("Failed to update article.");
      }
    } catch (error) {
      console.error("Error updating article:", error);
      alert("Server error.");
    }
  };

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');

      const response = await fetch(`https://aditya-b.onrender.com/research/wosarticles/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Article added successfully!");
        fetchArticles();
        setShowAddForm(false);
      } else {
        toast.error(data.message || "Failed to add article");
      }
    } catch (error) {
      console.error("Error adding article:", error);
      toast.error("Server error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://aditya-b.onrender.com/research/wosarticles/${userId}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        toast.success("Article deleted successfully!");
        fetchArticles();
      } else {
        alert("Failed to delete article.");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Server error.");
    }
  };

  return (
    <div style={{ padding: '15px' }}>
      <ToastContainer />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginBottom: '10px' }}>
        <input
          type="file"
          onChange={handleFileChange}
          style={{ border: '1px solid #ccc', padding: '5px', borderRadius: '5px', }}
        />
        <button
          onClick={handleUpload}
          style={{
            padding: '8px 12px',
            fontSize: '14px',
            color: '#fff',
            backgroundColor: '#007bff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '140px',
          }}
        >
          Upload
        </button>
        <button
          onClick={handleAddClick}
          style={{
            padding: '8px 12px',
            fontSize: '14px',
            color: '#fff',
            backgroundColor: '#007bff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '140px',
          }}
        >
          + Add
        </button>
      </div>

      <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '1rem' }}>
        b) Scopus/WoS Indexed Articles:
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
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Article details in IEEE format</th>
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>ISSN</th>
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Author Position</th>
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.length > 0 ? (
                articles.map((article, index) => (
                  <tr key={index} style={{ textAlign: 'center' }}>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{index + 1}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{article.articleDetails || '-'}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{article.ISSN || '-'}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{article.authorPosition || '-'}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleUpdateClick(article)} style={{ width: 'auto' }}>
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(article._id)} style={{ width: 'auto', backgroundColor: 'red', color: 'white' }}>
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>No articles found</td>
                </tr>
              )}
              <tr>
                <td className="p-2 border text-center font-bold" colSpan="2">
                  Self-Assessment Marks (Max: 10)
                </td>
                <td className="p-2 border text-center font-bold">{wosMarks}</td>
              </tr>
            </tbody>
          </table>
          {showEditForm && (
            <div className="update-form">
              <h2>Update Article</h2>
              <form onSubmit={handleEdit}>
                <input type="text" name="articleDetails" value={formData.articleDetails} onChange={handleInputChange} placeholder="Article Details" required />
                <input type="text" name="ISSN" value={formData.ISSN} onChange={handleInputChange} placeholder="ISSN" required />
                <input type="text" name="authorPosition" value={formData.authorPosition} onChange={handleInputChange} placeholder="Author Position" required />
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setShowEditForm(false)}>Cancel</button>
              </form>
            </div>
          )}
          {showAddForm && (
            <div className="add-form">
              <h2>Add Article</h2>
              <form onSubmit={handleAddFormSubmit}>
                <input type="text" name="articleDetails" value={formData.articleDetails} onChange={handleInputChange} placeholder="Article Details" required />
                <input type="text" name="ISSN" value={formData.ISSN} onChange={handleInputChange} placeholder="ISSN" required />
                <input type="text" name="authorPosition" value={formData.authorPosition} onChange={handleInputChange} placeholder="Author Position" required />
                <button type="submit">Add Article</button>
                <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WosArticles;
