import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SciArticles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await fetch('http://localhost:5000/research/sciarticles', {
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
          console.error("Error fetching articles");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/research/upload-sci", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        alert("File uploaded successfully!");
        setFile(null);
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div style={{ padding: '15px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginBottom: '10px' }}>
        
        {/* File Upload Input */}
        <input
          type="file"
          onChange={handleFileChange}
          style={{ border: '1px solid #ccc', padding: '5px', borderRadius: '5px' }}
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

        {/* Add Article Button */}
        <button 
          onClick={() => navigate('/sci-articles')} 
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
        a) SCI Indexed Articles:
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>No articles found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SciArticles;
