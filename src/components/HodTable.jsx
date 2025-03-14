import React from 'react';
import Navbar from './Navbar'

const AttitudeSkillsTable = () => {
  const parameters = [
    { id: 1, parameter: "Initiative: a self-starter; able to work without constant supervision" },
    { id: 2, parameter: "Responsibility: Understands duties; accepts responsibilities readily" },
    { id: 3, parameter: "Punctuality: arrives on time, available for students during working hours" },
    { id: 4, parameter: "Commitment: Committed to his/her work" },
    { id: 5, parameter: "Loyalty: Supports and follows institute’s policies and guidelines" },
    { id: 6, parameter: "Development: Keeps knowledge up to date" },
    { id: 7, parameter: "Communication: Speaks effectively with leadership, colleagues, and students" },
    { id: 8, parameter: "Teamwork: effective in a team" },
    { id: 9, parameter: "Leadership: gives clear directions and listens to co-workers" },
    { id: 10, parameter: "Relationship with students" },
  ];

  return (
    <>
    <Navbar/>
    <div style={{ padding: '60px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginBottom: '20px' }}>II. Attitude and Interpersonal Skills</h2>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #ddd',
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                border: '1px solid #ddd',
                padding: '10px',
                backgroundColor: 'rgb(255, 127, 39)',
                color: 'white',
                textAlign: 'left',
              }}
            >
              S. No
            </th>
            <th
              style={{
                border: '1px solid #ddd',
                padding: '10px',
                backgroundColor: 'rgb(255, 127, 39)',
                color: 'white',
                textAlign: 'left',
              }}
            >
              Parameter
            </th>
            <th
              style={{
                border: '1px solid #ddd',
                padding: '10px',
                backgroundColor: 'rgb(255, 127, 39)',
                color: 'white',
                textAlign: 'left',
              }}
            >
              HoD Score
            </th>
          </tr>
        </thead>
        <tbody>
          {parameters.map((param) => (
            <tr key={param.id}>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{param.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                {param.parameter}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default AttitudeSkillsTable;
