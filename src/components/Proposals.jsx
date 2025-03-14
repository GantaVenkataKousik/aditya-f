import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Proposals = () => {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/research/proposals', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProposals(data);
        } else {
          console.error("Error fetching proposals");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
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
      const response = await fetch("http://localhost:5000/research/upload-proposal", {
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

        {/* Add Proposal Button */}
        <button 
          onClick={() => navigate('/addproposals')} 
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
        c) Project Proposals Submitted / Funded:
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
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Submitted/Funded Proposal details</th>
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Funding Agency</th>
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {proposals.length > 0 ? (
                proposals.map((proposal, index) => (
                  <tr key={index} style={{ textAlign: 'center' }}>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{index + 1}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{proposal.proposalDetails || '-'}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{proposal.fundingAgency || '-'}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{proposal.amount || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>No proposals found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Proposals;
