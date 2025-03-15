import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';

const OthersResearch = ({ Id }) => {
  const [researches, setResearches] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://aditya-b.onrender.com/research/otherResearch/${Id}`);
        if (response.ok) {
          const data = await response.json();
          setResearches(data);
          console.log("Fetched data:", data);
        }
        else {
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
    fetchData();
  }, [])

  const handleEdit = async (id) => {
    const data = await fetch(`https://aditya-b.onrender.com/research/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (data.ok) {
      toast.success("Research updated successfully");
    } else {
      toast.error("Failed to update research");
    }
  };

  const handleDelete = async (id) => {
    const data = await fetch(`https://aditya-b.onrender.com/research/delete/${id}`, {
      method: 'DELETE',
    });
    if (data.ok) {
      toast.success("Research deleted successfully");
    } else {
      toast.error("Failed to delete research");
    }
  };
  return (
    <>
      <ToastContainer />
      <div style={{ padding: '20px' }}>
        <h2>Research Details:</h2>
        {researches.length > 0 ? (
          <div>
            {researches.map((research) => (
              <div
                key={research._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  padding: '15px',
                  marginBottom: '10px',
                  borderRadius: '5px',
                }}
              >
                <div>
                  <h3 onClick={() => navigate(`/researchtext/${research._id}`)}>{research.title}</h3>
                  <p>{research.description}</p>
                  <p>
                    <strong>Published Date:</strong>{' '}
                    {new Date(research.publishedDate).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleEdit(research._id)} style={{ width: 'auto' }}>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(research._id)} style={{ width: 'auto', backgroundColor: 'red', color: 'white' }}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No researches found.</p>
        )}
      </div>
    </>
  )
}

export default OthersResearch
