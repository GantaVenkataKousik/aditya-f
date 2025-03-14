import React from 'react';
import Navbar from './Navbar';
import { useParams,Link } from 'react-router-dom';
import Profile from "../images/default.jpg";

const Branch = (props) => {
  const { branchName } = useParams();
  console.log(branchName);

  const designationPriority = {
    "HOD": 1,
    "Principal":2,
    "Professor": 3,
    "Assistant Professor": 4,
    "PHD": 5, 
  };

  const faculties = props.faculty.filter(
    (lecturer) => lecturer.department === branchName
  ).sort((a,b)=> (designationPriority[a.designation] || 999)-(designationPriority[b.designation] || 999));

  if (!faculties || faculties.length === 0)
    return (
      <div>
        <Navbar />
        <h2 style={{ textAlign: 'center', marginTop: '20px' }}>
          No faculties found for the {branchName} department.
        </h2>
      </div>
    );

  return (
    <div>
      <Navbar />
      <h2
        style={{
          textAlign: 'center',
          margin: '20px 0',
          fontSize: '28px',
          fontWeight: 'bold',
        }}
      >
        Faculties of {branchName} Department
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          padding: '20px',
        }}
      >
        {faculties.map((faculty) => (
          <div
            key={faculty._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#f9f9f9',
            }}
          >
            <div
             style={{
                borderRadius: '50%',
                width: '80px',
                height: '80px',
                backgroundColor: '#ccc',
                margin: '0 auto 10px',
                overflow: 'hidden', 
             }}
            >
           <img
            src={faculty.profileImage || Profile} 
            alt={faculty.fullName}
           style={{
             width: '100%',
             height: '100%',
             objectFit: 'cover', 
           }}
          />
        </div>

            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '10px 0' }}>
              {faculty.fullName}
            </h3>
            <p style={{ color: '#555', fontSize: '14px' }}>
              {faculty.designation}
            </p>
            <Link to={`/teacher/${faculty._id}`}>
            <button
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#007bff')}
            >
              View Profile
            </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Branch;
