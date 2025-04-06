import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { toast, ToastContainer } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';

const FacultyScoreTable = ({ appraisalData }) => {
  const [data, setData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedScore, setEditedScore] = useState('');
  const [currentParameter, setCurrentParameter] = useState('');
  const [dataSource, setDataSource] = useState('loading');
  const [showNavbar, setShowNavbar] = useState(true);
  const [canModify, setCanModify] = useState(false);
  const fetchData = async () => {
    try {
      setDataSource('loading');
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://aditya-b.onrender.com/research/getdata?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("API Response:", responseData);

        // Convert object responseData into an array format
        const formattedData = [
          { s_no: 1, parameter: "Courses Average Pass %", max_score: 20, min_score_doctorate: 10, min_score_non_doctorate: 10, obtained_score: responseData.CouAvgPerMarks ?? '-' },
          { s_no: 2, parameter: "Course Feedback", max_score: 20, min_score_doctorate: 10, min_score_non_doctorate: 10, obtained_score: responseData.CoufeedMarks ?? '-' },
          { s_no: 3, parameter: "Proctoring Students Average Pass %", max_score: 20, min_score_doctorate: 10, min_score_non_doctorate: 10, obtained_score: responseData.ProctoringMarks ?? '-' },
          { s_no: "4a", parameter: "Research - SCI papers", max_score: 60, min_score_doctorate: 40, min_score_non_doctorate: 30, obtained_score: responseData.SciMarks ?? '-' },
          { s_no: "4b", parameter: "Research - Scopus/WoS Papers", max_score: 60, min_score_doctorate: 40, min_score_non_doctorate: 30, obtained_score: responseData.WosMarks ?? '-' },
          { s_no: "4c", parameter: "Research – Proposals Submitted/funded", max_score: 10, min_score_doctorate: 10, min_score_non_doctorate: 0, obtained_score: responseData.ProposalMarks ?? '-' },
          { s_no: "4d", parameter: "Research - Others", max_score: 10, min_score_doctorate: 0, min_score_non_doctorate: 0, obtained_score: responseData.ResearchSelfAssesMarks ?? '-' },
          { s_no: 5, parameter: "Workshops, FDPs, STTP attended", max_score: 20, min_score_doctorate: 15, min_score_non_doctorate: 20, obtained_score: responseData.WorkSelfAssesMarks ?? '-' },
          { s_no: 6, parameter: "Outreach Activities", max_score: 10, min_score_doctorate: 10, min_score_non_doctorate: 0, obtained_score: responseData.OutreachSelfAssesMarks ?? '-' },
          { s_no: 7, parameter: "Additional responsibilities in the Department / College", max_score: 20, min_score_doctorate: 20, min_score_non_doctorate: 20, obtained_score: responseData.AddSelfAssesMarks ?? '-' },
          { s_no: 8, parameter: "Special Contribution", max_score: 10, min_score_doctorate: 10, min_score_non_doctorate: 10, obtained_score: responseData.SpecialSelfAssesMarks ?? '-' },
        ];

        setData(formattedData);
        setDataSource('fetched');
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    console.log("role:", role);
    if (role === 'HOD' || role === 'Dean' || role === 'Admin') {
      setShowNavbar(false);
      setCanModify(true);
    }

    if (appraisalData) {
      setData(appraisalData);
      setDataSource('props');
    } else {
      fetchData();
    }
  }, [appraisalData]);

  // Open edit modal with the selected row data
  const handleEditClick = (row, index) => {
    setEditingIndex(index);
    setCurrentParameter(row.parameter);
    setEditedScore(row.obtained_score === '-' ? '0' : row.obtained_score);
    setShowEditModal(true);
  };

  // Update the score in the database
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem('userId');
      const adminId = localStorage.getItem('userId'); // Current user making the change

      if (!userId) {
        toast.error('User ID not found. Please log in again.');
        return;
      }

      // Map parameter name to API field name
      const parameterToFieldMap = {
        "Courses Average Pass %": "couAvgPerMarks",
        "Course Feedback": "CoufeedMarks",
        "Proctoring Students Average Pass %": "ProctoringMarks",
        "Research - SCI papers": "SciMarks",
        "Research - Scopus/WoS Papers": "WosMarks",
        "Research – Proposals Submitted/funded": "ProposalMarks",
        "Research - Others": "ResearchSelfAsses",
        "Workshops, FDPs, STTP attended": "WorkSelfAsses",
        "Outreach Activities": "OutreachSelfAsses",
        "Additional responsibilities in the Department / College": "AddSelfAsses",
        "Special Contribution": "SpeacialSelfAsses"
      };

      const fieldName = parameterToFieldMap[currentParameter];
      if (!fieldName) {
        toast.error('Invalid parameter name');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`https://aditya-b.onrender.com/faculty/update-score?userId=${adminId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          field: fieldName,
          value: parseInt(editedScore) || 0,
          parameter: currentParameter
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('Score updated successfully');

        // Update local state
        setData(prevData => {
          const newData = [...prevData];
          newData[editingIndex] = {
            ...newData[editingIndex],
            obtained_score: editedScore
          };
          return newData;
        });

        setShowEditModal(false);
      } else {
        toast.error(result.message || 'Failed to update score');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Network error while updating score');
    }
  };

  // Reset score to default (not actually deleting)
  const handleScoreReset = async (index) => {
    if (!window.confirm('Are you sure you want to reset this score to 0?')) {
      return;
    }

    const row = data[index];
    try {
      const userId = localStorage.getItem('userId');
      const adminId = localStorage.getItem('userId'); // Current user making the change

      if (!userId) {
        toast.error('User ID not found. Please log in again.');
        return;
      }

      // Map parameter name to API field name (same mapping as in handleUpdate)
      const parameterToFieldMap = {
        "Courses Average Pass %": "couAvgPerMarks",
        "Course Feedback": "CoufeedMarks",
        "Proctoring Students Average Pass %": "ProctoringMarks",
        "Research - SCI papers": "SciMarks",
        "Research - Scopus/WoS Papers": "WosMarks",
        "Research – Proposals Submitted/funded": "ProposalMarks",
        "Research - Others": "ResearchSelfAsses",
        "Workshops, FDPs, STTP attended": "WorkSelfAsses",
        "Outreach Activities": "OutreachSelfAsses",
        "Additional responsibilities in the Department / College": "AddSelfAsses",
        "Special Contribution": "SpeacialSelfAsses"
      };

      const fieldName = parameterToFieldMap[row.parameter];
      if (!fieldName) {
        toast.error('Invalid parameter name');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`https://aditya-b.onrender.com/faculty/reset-score?userId=${adminId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          field: fieldName,
          parameter: row.parameter
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('Score reset successfully');

        // Update local state
        setData(prevData => {
          const newData = [...prevData];
          newData[index] = {
            ...newData[index],
            obtained_score: '0'
          };
          return newData;
        });
      } else {
        toast.error(result.message || 'Failed to reset score');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Network error while resetting score');
    }
  };

  return (
    <>
      <ToastContainer />
      {showNavbar && <Navbar />}
      <div className="container mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Faculty Self Appraisal - Performance Parameters</h2>
        <table className="table-auto border-collapse border border-gray-400 w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 px-4 py-2">S. No</th>
              <th className="border border-gray-400 px-4 py-2">Parameter</th>
              <th className="border border-gray-400 px-4 py-2">Max Score</th>
              <th className="border border-gray-400 px-4 py-2">Min Score for Doctorate</th>
              <th className="border border-gray-400 px-4 py-2">Min Score for Non-Doctorate</th>
              <th className="border border-gray-400 px-4 py-2">Obtained Score</th>
              {canModify && (
                <th className="border border-gray-400 px-4 py-2 no-print">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((row, index) => (
                <tr key={index} className="text-center border border-gray-400">
                  <td className="border border-gray-400 px-4 py-2">{row.s_no}</td>
                  <td className="border border-gray-400 px-4 py-2">{row.parameter}</td>
                  <td className="border border-gray-400 px-4 py-2">{row.max_score}</td>
                  <td className="border border-gray-400 px-4 py-2">{row.min_score_doctorate}</td>
                  <td className="border border-gray-400 px-4 py-2">{row.min_score_non_doctorate}</td>
                  <td className="border border-gray-400 px-4 py-2">{row.obtained_score}</td>
                  {canModify && (
                    <td className="border border-gray-400 px-4 py-2 no-print">
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        <button
                          className="no-print"
                          onClick={(e) => { e.stopPropagation(); handleEditClick(row, index); }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px',
                            margin: "2px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            backgroundColor: "#1a4b88",
                            color: "white",
                            transition: "all 0.3s ease",
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            width: "36px",
                            height: "36px"
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e67528"}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1a4b88"}
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          className="no-print"
                          onClick={(e) => { e.stopPropagation(); handleScoreReset(index); }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px',
                            margin: "2px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            backgroundColor: "#e74c3c",
                            color: "white",
                            transition: "all 0.3s ease",
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            width: "36px",
                            height: "36px"
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#c0392b"}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#e74c3c"}
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center border border-gray-400 px-4 py-2">Loading data...</td>
              </tr>
            )}
            <tr className="font-bold bg-gray-100">
              <td className="border border-gray-400 px-4 py-2" colSpan="2">Total Marks</td>
              <td className="border border-gray-400 px-4 py-2">200</td>
              <td className="border border-gray-400 px-4 py-2">135</td>
              <td className="border border-gray-400 px-4 py-2">110</td>
              <td className="border border-gray-400 px-4 py-2">
                {data && data.length > 0 ? data.reduce((sum, row) => sum + (row.obtained_score !== '-' ? Number(row.obtained_score) : 0), 0) : 0}
              </td>
              <td className="border border-gray-400 px-4 py-2 no-print"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Edit Score Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 no-print">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Score</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Parameter</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded bg-gray-100"
                  value={currentParameter}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Score</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={editedScore}
                  onChange={(e) => {
                    // Find the current row to get max score
                    const currentRow = data[editingIndex];
                    const maxScore = currentRow ? parseInt(currentRow.max_score) : 100;

                    // Limit input to max score
                    const value = parseInt(e.target.value) || 0;
                    if (value <= maxScore && value >= 0) {
                      setEditedScore(value.toString());
                    } else if (value > maxScore) {
                      setEditedScore(maxScore.toString());
                    } else {
                      setEditedScore('0');
                    }
                  }}
                  min="0"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Max allowed: {data[editingIndex]?.max_score}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FacultyScoreTable;
