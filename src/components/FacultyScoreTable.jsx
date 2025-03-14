import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
const FacultyScoreTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/research/getdata', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log("API Response:", responseData); // Debugging log

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
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = async (id) => {
    const data = await fetch(`http://localhost:5000/research/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (data.ok) {
      toast.success("Research updated successfully");
    } else {
      toast.error("Failed to update research");
    }
  };

  const handleDelete = async (id) => {
    const data = await fetch(`http://localhost:5000/research/delete/${id}`, {
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
      <Navbar />
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
              <th className="border border-gray-400 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr key={index} className="text-center border border-gray-400">
                  <td className="border border-gray-400 px-4 py-2">{row.s_no}</td>
                  <td className="border border-gray-400 px-4 py-2">{row.parameter}</td>
                  <td className="border border-gray-400 px-4 py-2">{row.max_score}</td>
                  <td className="border border-gray-400 px-4 py-2">{row.min_score_doctorate}</td>
                  <td className="border border-gray-400 px-4 py-2">{row.min_score_non_doctorate}</td>
                  <td className="border border-gray-400 px-4 py-2">{row.obtained_score}</td>
                  <td className="border border-gray-400 px-4 py-2">
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => handleEdit(row._id)} style={{ width: 'auto' }}>
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(row._id)} style={{ width: 'auto', backgroundColor: 'red', color: 'white' }}>  <FaTrash /> </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center border border-gray-400 px-4 py-2">Loading data...</td>
              </tr>
            )}
            <tr className="font-bold bg-gray-100">
              <td className="border border-gray-400 px-4 py-2" colSpan="2">Total Marks</td>
              <td className="border border-gray-400 px-4 py-2">200</td>
              <td className="border border-gray-400 px-4 py-2">135</td>
              <td className="border border-gray-400 px-4 py-2">110</td>
              <td className="border border-gray-400 px-4 py-2">
                {data.reduce((sum, row) => sum + (row.obtained_score !== '-' ? Number(row.obtained_score) : 0), 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default FacultyScoreTable;
