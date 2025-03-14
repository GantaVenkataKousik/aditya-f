import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Profile from "../images/default.jpg";

const Faculty = (props) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log(token);
        const response = await fetch('http://localhost:5000/fetchData', { 
          method: 'GET',
          credentials: 'include',  // This line is important (Error occurs if this is not there).
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          console.log(data.department);
        } else {
          console.error('Failed to fetch user:', response.statusText);
        }
      } catch (error) {
        console.error('Error occurred:', error);
      }
    };
    fetchUser();
  }, []);

  const renderFaculty = props.faculty
    .filter((teacher) => teacher.department === user.department && teacher.designation!=='HOD' )
    .map((teacher) => (
      <div
        key={teacher._id}
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '15px',
          margin: '10px',
          width: '220px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}
      >
        <div
         style={{
         borderRadius: '50%',
         width: '80px',
         height: '80px',
         backgroundColor: '#ccc',
         margin: '0 auto',
         overflow: 'hidden', // Prevents overflow
       }}
       >
      <img
      src={Profile}
      alt="Profile"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover', // Ensures the image scales properly
        borderRadius: '50%', // Matches the parent container for circular shape
     }}
    />
    </div>

        <div style={{ marginTop: '10px', fontWeight: 'bold', fontSize: '18px' }}>
          {teacher.fullName}
        </div>
        <div style={{ color: '#555', fontSize: '14px' }}>{teacher.department}</div>
        <div>
          <Link to={`/teacher/${teacher._id}`}>
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
              View Details
            </button>
          </Link>
        </div>
      </div>
    ));

  const renderAll = props.faculty
    .filter((teacher) => teacher.designation !== 'Dean')
    .map((teacher) => (
      <div
        key={teacher._id}
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '15px',
          margin: '10px',
          width: '220px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}
      >
        <div
         style={{
         borderRadius: '50%',
         width: '80px',
         height: '80px',
         backgroundColor: '#ccc',
         margin: '0 auto',
         overflow: 'hidden', // Prevents overflow
        }}
      >
      <img
       src={Profile}
       alt="Profile"
        style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover', // Ensures the image scales properly
        borderRadius: '50%', // Matches the parent container for circular shape
      }}
     />
    </div>

        <div style={{ marginTop: '10px', fontWeight: 'bold', fontSize: '18px' }}>
          {teacher.fullName}
        </div>
        <div style={{ color: '#555', fontSize: '14px' }}>{teacher.department}</div>
        <div>
          <Link to={`/teacher/${teacher._id}`}>
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
              View Details
            </button>
          </Link>
        </div>
      </div>
    ));

    const renderOverAll = props.faculty
    .filter((teacher) => teacher.designation !== 'Admin')
    .map((teacher) => (
      <div
        key={teacher._id}
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '15px',
          margin: '10px',
          width: '220px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
          borderRadius: '50%',
          width: '80px',
          height: '80px',
          backgroundColor: '#ccc',
          margin: '0 auto',
          overflow: 'hidden', // Prevents overflow
         }}
       >
       <img
        src={Profile}
        alt="Profile"
        style={{
         width: '100%',
         height: '100%',
         objectFit: 'cover', // Ensures the image scales properly
         borderRadius: '50%', // Matches the parent container for circular shape
       }}
      />
    </div>

        <div style={{ marginTop: '10px', fontWeight: 'bold', fontSize: '18px' }}>
          {teacher.fullName}
        </div>
        <div style={{ color: '#555', fontSize: '14px' }}>{teacher.department}</div>
        <div>
          <Link to={`/teacher/${teacher._id}`}>
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
              View Details
            </button>
          </Link>
        </div>
      </div>
    ));

  return (
    <div>

      {user.designation==='HOD' && <h2
        style={{
          fontWeight: 'bold',
          fontSize: '28px',
          textAlign: 'center',
          marginBottom: '20px',
        }}
      >
        Faculty Details of {user.department} department:
      </h2> }
      {/* {user.designation==='Dean' && <h2
        style={{
          fontWeight: 'bold',
          fontSize: '28px',
          textAlign: 'center',
          marginBottom: '20px',
        }}
      >
        Details of Faculties:
      </h2> } */}
     
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {user.designation === 'HOD' && renderFaculty}
        {/* {user.designation === 'Dean' && renderAll}
        {user.designation==='Admin' && renderOverAll} */}
      </div>
    </div>
  );
};

export default Faculty;
