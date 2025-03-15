import React, { useState, useEffect } from 'react';
import MyPieChart from './MyPiechart';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import aboutLogo from '../images/aditya-logo.webp'

const DisplayClasses = () => {
  const [classes, setClasses] = useState([]);
  const [rating, setRating] = useState(0);
  const [chartData, setChartData] = useState({
    above95: 0,
    between85And95: 0,
    between75And85: 0,
    below75: 0,
    passPercentage: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }
        const userId = localStorage.getItem('userId');
        const response = await fetch(`https://aditya-b.onrender.com/classes/raw?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error(`Failed to fetch data: ${response.statusText}`);
          const errorMessage = await response.text();
          console.error('Error message:', errorMessage);
          return;
        }

        const data = await response.json();

        setClasses(data.Data);
        setRating(data.overallRating);

        const newChartData = {
          above95: 0,
          between85And95: 0,
          between75And85: 0,
          below75: 0,
          passPercentage: 0,
        };

        data.Data.forEach((classItem) => {
          newChartData.above95 = classItem.above95 || 0;
          newChartData.between85And95 = classItem.between85And95 || 0;
          newChartData.between75And85 = classItem.between75And85 || 0;
          newChartData.below75 = classItem.below75 || 0;
          newChartData.passPercentage = classItem.passPercentage || 0;
        });

        if (data.Data.length > 0) {
          newChartData.passPercentage /= data.Data.length;
        }

        setChartData(newChartData);
      } catch (error) {
        console.error('Error occurred while fetching data:', error);
      }
    };

    fetchData();
  }, []);
  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>


      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Class Performance Dashboard</h1>
      <h2 style={{
        textAlign: 'center',
        color: 'rgb(255, 127, 39)',
        fontWeight: 'bold',
        borderBottom: '2px solid rgb(255, 127, 39)',
        paddingBottom: '10px',
        display: 'inline-block',
        marginBottom: '30px',

      }}>
        Overall Rating: {rating}
      </h2>

      {classes.length > 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          {classes.map((classItem) => {
            const generateLink = () => {
              const link = `http://localhost:5173/rate/${classItem._id}`;
              navigator.clipboard.writeText(link);
              alert('Link copied to clipboard!');
            };

            return (
              <div
                key={classItem._id}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '20px',
                  backgroundColor: '#fdfdfd',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  width: '100%',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '15px',
                }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: '1.5rem',
                    color: '#4CAF50',
                  }}>

                    {classItem.courseName}
                  </h3>
                  <span style={{
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                  }}>
                    Rating: {classItem.rating}
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '15px',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                }}>
                  <div>
                    <p><strong>Attended:</strong>    {classItem.appeared} </p>
                    <p><strong>Semester:</strong> {classItem.semester}</p>
                    <p><strong>Branch:</strong> {classItem.branch}</p>
                  </div>
                  <div>
                    <p><strong>Section:</strong> {classItem.section}</p>
                    <p><strong>Number of Students:</strong> {classItem.numberOfStudents}</p>
                    <p><strong>Pass Percentage:</strong> {classItem.passPercentage}%</p>
                  </div>
                </div>

                <div style={{
                  marginTop: '20px',
                  padding: '10px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '5px',
                  border: '1px solid #eee',
                }}>

                  <MyPieChart id={`chart-${classItem._id}`} chartData={chartData} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '20px' }}>
                  <span style={{ fontSize: '1rem', color: '#333', fontWeight: '500' }}>
                    Share this link to the Students for Feedback
                  </span>
                  <button className='no-print' onClick={generateLink} style={{
                    padding: '10px 15px',
                    backgroundColor: "rgb(117 117 117)",
                    color: '#fff',
                    width: '150px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                  }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#rgb(117 117 117)'}>
                    Share Link
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ textAlign: 'center', fontSize: '18px', color: '#FF5722' }}>No classes found.</p>
      )}
    </div>
  );
};

export default DisplayClasses;