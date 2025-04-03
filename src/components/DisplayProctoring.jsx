import React, { useEffect, useState } from 'react';
import './DisplayProctoring.css'; // Import the CSS file
import { toast, ToastContainer } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

const ProctoringTable = ({ proctoringData }) => {
    const [data, setData] = useState(proctoringData || []);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
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
            <div className='add-proctoring-button-container' style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginTop: '20px',
                marginBottom: '20px'
            }}>
                <button
                    onClick={handleAddClick}
                    className='add-proctoring-button no-print'
                    style={{
                        backgroundColor: '#1a4b88',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '10px 16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '16px',
                        fontWeight: '500',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    }}
                >
                    <FaPlus /> Add Proctoring
                </button>
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
                        <th>Actions</th>
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
                                    <td style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                        <button
                                            onClick={() => handleUpdateClick(proctor)}
                                            className='no-print'
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
                                            onClick={() => handleDelete(proctor._id)}
                                            className='no-print'
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
                                    </td>
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

            {/* Modal popup for Edit Form */}
            {showEditForm && (
                <div className='modal-overlay' style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div className='update-form' style={{
                        backgroundColor: 'white',
                        padding: '25px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        width: '90%',
                        maxWidth: '500px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#333' }}>Update Proctoring Data</h2>
                            <button
                                onClick={() => setShowEditForm(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                    color: '#777'
                                }}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleEdit}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Total Students</label>
                                    <input
                                        type="number"
                                        name="totalStudents"
                                        value={formData.totalStudents}
                                        onChange={handleInputChange}
                                        placeholder="Total Students"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Semester-Branch-Section</label>
                                    <input
                                        type="text"
                                        name="semesterBranchSec"
                                        value={formData.semesterBranchSec}
                                        onChange={handleInputChange}
                                        placeholder="Semester-Branch-Section"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>No. of Students Eligible (A)</label>
                                    <input
                                        type="number"
                                        name="eligibleStudents"
                                        value={formData.eligibleStudents}
                                        onChange={handleInputChange}
                                        placeholder="No. of Students Eligible for End Exams (A)"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>No. of Students Passed (B)</label>
                                    <input
                                        type="number"
                                        name="passedStudents"
                                        value={formData.passedStudents}
                                        onChange={handleInputChange}
                                        placeholder="No. of Students Passed (B)"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Average %</label>
                                    <input
                                        type="number"
                                        name="averagePercentage"
                                        value={formData.averagePercentage}
                                        onChange={handleInputChange}
                                        placeholder="Average %"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Self-Assessment Marks</label>
                                    <input
                                        type="number"
                                        name="selfAssessmentMarks"
                                        value={formData.selfAssessmentMarks}
                                        onChange={handleInputChange}
                                        placeholder="Self-Assessment Marks"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Side by side buttons */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '15px' }}>
                                <button
                                    type='button'
                                    onClick={() => setShowEditForm(false)}
                                    className='no-print'
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#f5f5f5',
                                        color: '#333',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        width: '45%'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    className='no-print'
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#1a4b88',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        width: '45%'
                                    }}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal popup for Add Form */}
            {showAddForm && (
                <div className='modal-overlay' style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div className='add-form' style={{
                        backgroundColor: 'white',
                        padding: '25px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        width: '90%',
                        maxWidth: '500px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#333' }}>Add Proctoring Data</h2>
                            <button
                                onClick={() => setShowAddForm(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                    color: '#777'
                                }}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleAddFormSubmit}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Total Students</label>
                                    <input
                                        type="number"
                                        name="totalStudents"
                                        value={formData.totalStudents}
                                        onChange={handleInputChange}
                                        placeholder="Total Students"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Semester-Branch-Section</label>
                                    <input
                                        type="text"
                                        name="semesterBranchSec"
                                        value={formData.semesterBranchSec}
                                        onChange={handleInputChange}
                                        placeholder="Semester-Branch-Section"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>No. of Students Eligible (A)</label>
                                    <input
                                        type="number"
                                        name="eligibleStudents"
                                        value={formData.eligibleStudents}
                                        onChange={handleInputChange}
                                        placeholder="No. of Students Eligible for End Exams (A)"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>No. of Students Passed (B)</label>
                                    <input
                                        type="number"
                                        name="passedStudents"
                                        value={formData.passedStudents}
                                        onChange={handleInputChange}
                                        placeholder="No. of Students Passed (B)"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Average % (Auto-calculated)</label>
                                    <input
                                        type="number"
                                        name="averagePercentage"
                                        value={formData.averagePercentage || ''}
                                        readOnly
                                        placeholder="Average % (Auto-calculated)"
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box',
                                            backgroundColor: '#f0f0f0'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Self-Assessment Marks</label>
                                    <input
                                        type="number"
                                        name="selfAssessmentMarks"
                                        value={formData.selfAssessmentMarks}
                                        onChange={handleInputChange}
                                        placeholder="Self-Assessment Marks"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Side by side buttons */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '15px' }}>
                                <button
                                    type='button'
                                    onClick={() => setShowAddForm(false)}
                                    className='no-print'
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#f5f5f5',
                                        color: '#333',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        width: '45%'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    className='no-print'
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#1a4b88',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        width: '45%'
                                    }}
                                >
                                    Add Proctoring
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProctoringTable;
