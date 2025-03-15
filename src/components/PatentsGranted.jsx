import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PatentsGranted = () => {
  const navigate = useNavigate();
  const [patents, setPatents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://aditya-b.onrender.com/research/pgranted', {
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

    fetchPatents();
  }, []);

  return (
    <div style={{ padding: '15px' }}>
      <div style={{ width: '90px', marginLeft: '1100px' }}>
        <button onClick={() => navigate('/addpgranted')}> + Add</button>
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
              </tr>
            </thead>
            <tbody>
              {patents.length > 0 ? (
                patents.map((patent, index) => (
                  <tr key={index} style={{ textAlign: 'center' }}>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{index + 1}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{patent.PTitle || '-'}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{patent.PNumber || '-'}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{patent.CountryGranted || '-'}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{patent.GrantedDate || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>No patents granted found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatentsGranted;
