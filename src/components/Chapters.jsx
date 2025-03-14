import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Chapters = () => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/research/chapters', {
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

  return (
    <div style={{ padding: '15px' }}>
      <div style={{ width: '90px', marginLeft: '1100px' }}>
        <button onClick={() => navigate('/addchapters')}> + Add</button>
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>No chapters found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Chapters;
