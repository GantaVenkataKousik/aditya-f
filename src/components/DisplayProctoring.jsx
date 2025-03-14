import React, { useEffect, useState } from 'react';
import './DisplayProctoring.css'; // Import the CSS file
import { toast, ToastContainer } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';
const ProctoringTable = ({ proctoringData }) => {
    const [data, setData] = useState(proctoringData || []); // Initialize with props data if available
    const [showForm, setShowForm] = useState(false);
    const [selectedProctor, setSelectedProctor] = useState(null);
    const [formData, setFormData] = useState({
        totalStudents: '',
        semesterBranchSec: '',
        eligibleStudents: '',
        passedStudents: '',
        averagePercentage: '',
        selfAssessmentMarks: '',
        teacher: ''
    });
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("No token found in localStorage");
                return;
            }

            const response = await fetch('http://localhost:5000/proc/proctoring-data', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                console.error(`Failed to fetch data: ${response.statusText}`);
                return;
            }

            const fetchedData = await response.json();
            if (Array.isArray(fetchedData.data)) {
                setData(fetchedData.data);
            } else {
                console.error("Unexpected API response format:", fetchedData);
                setData([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        if (!proctoringData) {
            // Fetch data from API only if no data is passed via props
            fetchData();
        }
    }, [proctoringData]);

    // Function to calculate self-assessment marks
    const getSelfAssessmentMarks = (passPercentage) => {
        if (passPercentage >= 95) return 20;
        if (passPercentage >= 85) return 15;
        if (passPercentage >= 75) return 10;
        return 0;
    };
    const handleUpdateClick = (proctor) => {
        setShowForm(true);
        setSelectedProctor(proctor);
        setFormData(proctor);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleEdit = async () => {
        const response = await fetch(`http://localhost:5000/proctoring/${selectedProctor._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (data.success) {
            toast.success("Proctoring data updated successfully");
            fetchData();
        } else {
            toast.error("Failed to update proctoring data");
        }
    };
    const handleDelete = async (id) => {
        const response = await fetch(`http://localhost:5000/proctoring/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (data.success) {
            toast.success("Proctoring data deleted successfully");
            fetchData();
        } else {
            toast.error("Failed to delete proctoring data");
        }
    };


    return (
        <div>
            <ToastContainer />
            <table className="proctoring-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>No. of Students Allotted</th>
                        <th>Sem-Branch-Sec</th>
                        <th>No. of Students Eligible for End Exams (A)</th>
                        <th>No. of Students Passed (B)</th>
                        <th>Pass Percentage (B/A * 100)</th>
                        <th>Average %</th>
                        <th>Self-Assessment Marks</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(data) && data.length > 0 ? (
                        data.map((proctor, index) => {
                            const passPercentage = ((proctor.passedStudents / proctor.eligibleStudents) * 100).toFixed(2);
                            const selfAssessmentMarks = getSelfAssessmentMarks(passPercentage);

                            return (
                                <tr key={proctor.id || index}>
                                    <td>{index + 1}</td>
                                    <td>{proctor.totalStudents}</td>
                                    <td>{proctor.semesterBranchSec}</td>
                                    <td>{proctor.eligibleStudents}</td>
                                    <td>{proctor.passedStudents}</td>
                                    <td>{passPercentage}%</td>

                                    {/* Render "Average %" and "Self-Assessment Marks" only in the first row */}
                                    {index === 0 && (
                                        <>
                                            <td rowSpan={data.length}>{data[data.length - 1]?.averagePercentage || 'N/A'}</td>
                                            <td rowSpan={data.length}>{data[data.length - 1]?.selfAssessmentMarks || selfAssessmentMarks}</td>
                                        </>
                                    )}
                                    <td style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                        <button className='no-print' onClick={() => handleUpdateClick(proctor)} style={{ width: 'auto' }}> <FaEdit /> </button>
                                        <button className='no-print' onClick={() => handleDelete(proctor._id)} style={{ width: 'auto', backgroundColor: 'red', color: 'white' }}> <FaTrash /> </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center' }}>No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {showForm && (
                <div className="update-form">
                    <h2>Update Proctoring Data</h2>
                    <form onSubmit={handleEdit}>
                        <input type="number" name="totalStudents" value={formData.totalStudents} onChange={handleInputChange} placeholder="Total Students" required />
                        <input type="text" name="semesterBranchSec" value={formData.semesterBranchSec} onChange={handleInputChange} placeholder="Semester-Branch-Section" required />
                        <input type="number" name="eligibleStudents" value={formData.eligibleStudents} onChange={handleInputChange} placeholder="No. of Students Eligible for End Exams (A)" required />
                        <input type="number" name="passedStudents" value={formData.passedStudents} onChange={handleInputChange} placeholder="No. of Students Passed (B)" required />
                        <input type="number" name="averagePercentage" value={formData.averagePercentage} onChange={handleInputChange} placeholder="Average %" required />
                        <input type="number" name="selfAssessmentMarks" value={formData.selfAssessmentMarks} onChange={handleInputChange} placeholder="Self-Assessment Marks" required />
                        <button className='no-print' type="submit">Save Changes</button>
                        <button className='no-print' type="button" onClick={() => setShowForm(false)}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProctoringTable;
