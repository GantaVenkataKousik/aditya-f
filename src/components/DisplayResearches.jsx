import React, { useState, useEffect } from 'react';
import { MdDelete } from "react-icons/md";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
const DisplayResearches = () => {
  const [researches, setResearches] = useState([]);
  const [filter, setFilter] = useState('approved');
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  const hoverStyle = {
    cursor: 'pointer',
    color: hover ? '#007bff' : '#000',
    textDecoration: hover ? 'underline' : 'none',
    transition: 'color 0.1s, text-decoration 0.1s',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`https://aditya-b.onrender.com/research/data?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setResearches(data);
          console.log('Fetched Researches:', data);
        } else {
          console.error('Failed to fetch researches:', response.statusText);
        }
      } catch (error) {
        console.error('Error occurred:', error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch(`https://aditya-b.onrender.com/research/delete/${id}?userId=${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setResearches(researches.filter((research) => research._id !== id));
        console.log('Research deleted successfully.');
      } else {
        console.error('Failed to delete research:', response.statusText);
      }
    } catch (error) {
      console.error('Error occurred while deleting research:', error);
    }
  };

  const handleUpdate = async (id) => {
    const userId = localStorage.getItem('userId');
    const updatedTitle = prompt('Enter the new title:');
    const updatedDescription = prompt('Enter the new description:');

    if (!updatedTitle || !updatedDescription) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://aditya-b.onrender.com/research/update/${id}?userId=${userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: updatedTitle,
          description: updatedDescription,
        }),
      });

      if (response.ok) {
        const updatedResearch = await response.json();
        setResearches(researches.map((research) =>
          research._id === id ? updatedResearch : research
        ));
        console.log('Research updated successfully.');
      } else {
        console.error('Failed to update research:', response.statusText);
      }
    } catch (error) {
      console.error('Error occurred while updating research:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: '20px', width: '130px', height: '30px' }}
      >
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="notApproved">Not Approved</option>
      </select>

      {researches.length > 0 ? (
        <div>
          {researches
            .filter((research) => {
              if (filter === 'approved') return research.status === true && research.rejected === false;
              if (filter === 'rejected') return research.status === false && research.rejected === true;
              if (filter === 'notApproved') return research.status === false && research.rejected === false;
              return true;
            })
            .map((research) => (
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
                  <h3
                    style={hoverStyle}
                    //  onClick={() => navigate(`/researchtext/${research._id}`)}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                  >
                    {research.title}
                  </h3>
                  <p>{research.description}</p>
                  <p>
                    <strong>Published Date:</strong>{' '}
                    {new Date(research.publishedDate).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleUpdate(research._id)}
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                    className='no-print'
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(research._id)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                    className='no-print'
                  >
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
  );
};

export default DisplayResearches;
