import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Proposals = () => {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [proposalMarks, setProposalMarks] = useState(0);
  const [formData, setFormData] = useState({
    proposalDetails: '',
    fundingAgency: '',
    amount: ''
  });
  const fetchProposals = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://aditya-b.onrender.com/research/proposals/${userId}`, {
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
  useEffect(() => {


    fetchProposals();
    const proposalMarks = localStorage.getItem('proposlmarks');
    setProposalMarks(proposalMarks);
  }, []);

  const handleAddClick = () => {
    setFormData({
      proposalDetails: '',
      fundingAgency: '',
      amount: ''
    });
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const handleUpdateClick = (proposal, index) => {
    setShowEditForm(true);
    setShowAddForm(false);
    setSelectedProposal({ ...proposal, index });
    setFormData(proposal);
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
      const response = await fetch(`https://aditya-b.onrender.com/research/proposals/${userId}/${selectedProposal.index}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success("Proposal updated successfully!");
        setShowEditForm(false);
        fetchProposals();
      } else {
        console.error("Error updating proposal");
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
      const response = await fetch(`https://aditya-b.onrender.com/research/proposals/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success("Proposal added successfully!");
        setShowAddForm(false);
        fetchProposals();
      } else {
        console.error("Error adding proposal");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (index) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://aditya-b.onrender.com/research/proposals/${userId}/${index}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success("Proposal deleted successfully!");
        fetchProposals();
      } else {
        console.error("Error deleting proposal");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ padding: '15px' }}>
      <ToastContainer />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginBottom: '10px' }}>
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
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Actions</th>
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
                    <td style={{ display: 'flex', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleUpdateClick(proposal, index)} style={{ width: 'auto' }}>
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
                  <td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>No proposals found</td>
                </tr>
              )}
              <tr>
                <td className="p-2 border text-center font-bold" colSpan="2">
                  Self-Assessment Marks (Max: 10)
                </td>
                <td className="p-2 border text-center font-bold">{proposalMarks}</td>
              </tr>
            </tbody>
          </table>
          {showEditForm && (
            <div className="update-form">
              <h2>Update Proposal</h2>
              <form onSubmit={handleEdit}>
                <input type="text" name="proposalDetails" value={formData.proposalDetails} onChange={handleInputChange} placeholder="Proposal Details" required />
                <input type="text" name="fundingAgency" value={formData.fundingAgency} onChange={handleInputChange} placeholder="Funding Agency" required />
                <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} placeholder="Amount" required />
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setShowEditForm(false)}>Cancel</button>
              </form>
            </div>
          )}
          {showAddForm && (
            <div className="add-form">
              <h2>Add Proposal</h2>
              <form onSubmit={handleAddFormSubmit}>
                <input type="text" name="proposalDetails" value={formData.proposalDetails} onChange={handleInputChange} placeholder="Proposal Details" required />
                <input type="text" name="fundingAgency" value={formData.fundingAgency} onChange={handleInputChange} placeholder="Funding Agency" required />
                <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} placeholder="Amount" required />
                <button type="submit">Add Proposal</button>
                <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Proposals;
