import React, { useEffect, useState } from 'react';
import './DisplayProctoring.css'; // Import the CSS file
import { toast, ToastContainer } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ProctoringTable = ({ proctoringData }) => {
    const [data, setData] = useState(proctoringData || []);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedProctor, setSelectedProctor] = useState(null);
    const [canModify, setCanModify] = useState(false);
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
            const userId = localStorage.getItem('userId');
            const response = await fetch(`https://aditya-b.onrender.com/proctoring/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
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
        if (proctoringData) {
            setData(proctoringData);
        } else {
            fetchData();
        }
        const role = localStorage.getItem('role');
        if (role === 'Admin' || role === 'Faculty') {
            setCanModify(true);
        }
    }, [proctoringData]);

    // Function to calculate self-assessment marks
    const getSelfAssessmentMarks = (passPercentage) => {
        if (passPercentage >= 95) return 20;
        if (passPercentage >= 85) return 15;
        if (passPercentage >= 75) return 10;
        return 0;
    };

    // Function to calculate pass percentage for a single record
    const calculatePassPercentage = (passed, eligible) => {
        return ((passed / eligible) * 100).toFixed(2);
    };

    // Function to calculate average percentage from all records
    const calculateAveragePercentage = (records) => {
        if (!records || records.length === 0) return 0;
        const sum = records.reduce((acc, record) => {
            const passPercentage = calculatePassPercentage(record.passedStudents, record.eligibleStudents);
            return acc + parseFloat(passPercentage);
        }, 0);
        return (sum / records.length).toFixed(2);
    };

    const handleUpdateClick = (proctor) => {
        setShowEditForm(true);
        setShowAddForm(false);
        setSelectedProctor(proctor);
        setFormData(proctor);
    };

    const handleAddClick = () => {
        setFormData({
            totalStudents: '',
            semesterBranchSec: '',
            eligibleStudents: '',
            passedStudents: '',
            averagePercentage: '',
            selfAssessmentMarks: '',
            teacher: ''
        });
        setShowAddForm(true);
        setShowEditForm(false);
    };

    // Modified handleInputChange to auto-calculate average
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };

        // If either passedStudents or eligibleStudents is updated
        if (name === 'passedStudents' || name === 'eligibleStudents') {
            if (newFormData.passedStudents && newFormData.eligibleStudents) {
                // Calculate new average including the current form data
                const currentRecords = [...data];
                const tempRecord = {
                    passedStudents: parseInt(newFormData.passedStudents),
                    eligibleStudents: parseInt(newFormData.eligibleStudents)
                };

                const newAverage = calculateAveragePercentage([...currentRecords, tempRecord]);
                newFormData.averagePercentage = newAverage;
            }
        }

        setFormData(newFormData);
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        const response = await fetch(`https://aditya-b.onrender.com/proctoring/${selectedProctor._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (data.success) {
            toast.success("Proctoring data updated successfully");
            setShowEditForm(false);
            fetchData();
        } else {
            toast.error("Failed to update proctoring data");
        }
    };

    // Modified handleAddFormSubmit
    const handleAddFormSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');

        // Calculate the pass percentage for the new record
        const passPercentage = calculatePassPercentage(
            parseInt(formData.passedStudents),
            parseInt(formData.eligibleStudents)
        );

        // Calculate new average including all records
        const newAverage = calculateAveragePercentage([
            ...data,
            {
                passedStudents: parseInt(formData.passedStudents),
                eligibleStudents: parseInt(formData.eligibleStudents)
            }
        ]);

        try {
            const response = await fetch(`https://aditya-b.onrender.com/proctoring/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    averagePercentage: newAverage,
                }),
            });

            if (response.ok) {
                const newProctoring = await response.json();
                setData([...data, newProctoring]);
                setShowAddForm(false);
                fetchData();
                toast.success('Proctoring data added successfully');
            } else {
                toast.error('Failed to add proctoring data');
            }
        } catch (error) {
            console.error('Error adding proctoring data:', error);
            toast.error('Failed to add proctoring data');
        }
    };

    const handleDelete = async (id) => {
        const response = await fetch(`https://aditya-b.onrender.com/proctoring/${id}`, {
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
            <div className='add-proctoring-button-container' style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', marginTop: '20px' }}>
                {canModify && (
                    <button onClick={handleAddClick} className='add-proctoring-button' style={{ color: 'white', border: 'none', borderRadius: '5px', padding: '10px', cursor: 'pointer', width: '200px', height: '40px' }}>Add Proctoring</button>
                )}
            </div>
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
                        {canModify && (
                            <th>Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(data) && data.length > 0 ? (
                        data.map((proctor, index) => {
                            const passPercentage = calculatePassPercentage(proctor.passedStudents, proctor.eligibleStudents);
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
                                    {canModify && (
                                        <td style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                            <button className='no-print' onClick={() => handleUpdateClick(proctor)} style={{ width: 'auto' }}> <FaEdit /> </button>
                                            <button className='no-print' onClick={() => handleDelete(proctor._id)} style={{ width: 'auto', backgroundColor: 'red', color: 'white' }}> <FaTrash /> </button>
                                        </td>
                                    )}
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="9" style={{ textAlign: 'center' }}>No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {canModify && showEditForm && (
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
                        <button className='no-print' type="button" onClick={() => setShowEditForm(false)}>Cancel</button>
                    </form>
                </div>
            )}
            {canModify && showAddForm && (
                <div className="add-form">
                    <h2>Add Proctoring Data</h2>
                    <form onSubmit={handleAddFormSubmit}>
                        <input
                            type="number"
                            name="totalStudents"
                            value={formData.totalStudents}
                            onChange={handleInputChange}
                            placeholder="Total Students"
                            required
                        />
                        <input
                            type="text"
                            name="semesterBranchSec"
                            value={formData.semesterBranchSec}
                            onChange={handleInputChange}
                            placeholder="Semester-Branch-Section"
                            required
                        />
                        <input
                            type="number"
                            name="eligibleStudents"
                            value={formData.eligibleStudents}
                            onChange={handleInputChange}
                            placeholder="No. of Students Eligible for End Exams (A)"
                            required
                        />
                        <input
                            type="number"
                            name="passedStudents"
                            value={formData.passedStudents}
                            onChange={handleInputChange}
                            placeholder="No. of Students Passed (B)"
                            required
                        />
                        <input
                            type="number"
                            name="averagePercentage"
                            value={formData.averagePercentage || ''}
                            readOnly
                            placeholder="Average % (Auto-calculated)"
                            style={{ backgroundColor: '#f0f0f0' }}
                        />
                        <input
                            type="number"
                            name="selfAssessmentMarks"
                            value={formData.selfAssessmentMarks}
                            onChange={handleInputChange}
                            placeholder="Self-Assessment Marks"
                            required
                        />
                        <button className='no-print' type="submit">Add Proctoring</button>
                        <button className='no-print' type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProctoringTable;
