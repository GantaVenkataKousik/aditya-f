import React, { useEffect, useState } from 'react';
import './DisplayCourses.css'; // Import the CSS file
import { FaEdit, FaTrash, FaPlus, FaTimes, FaHistory } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DisplayFeedback = ({ feedbackData }) => {
    const [data, setData] = useState(feedbackData || []);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [formData, setFormData] = useState({
        courseName: '',
        semester: '',
        numberOfStudents: 0,
        feedbackPercentage: 0,
        averagePercentage: 0
    });
    const [showOperations, setShowOperations] = useState(false);
    const [overallAverage, setOverallAverage] = useState(0);
    const [overallSelfAssessment, setOverallSelfAssessment] = useState(0);

    const calculateAverages = (feedbackData) => {
        if (!feedbackData || feedbackData.length === 0) return { avg: 0, selfAssessment: 0 };

        const totalFeedback = feedbackData.reduce((sum, item) => sum + Number(item.feedbackPercentage || 0), 0);
        const avgFeedback = totalFeedback / feedbackData.length;

        // Calculate self assessment based on average feedback
        let selfAssessment = 4; // default
        if (avgFeedback >= 90) {
            selfAssessment = 10;
        } else if (avgFeedback >= 80) {
            selfAssessment = 8;
        } else if (avgFeedback >= 70) {
            selfAssessment = 6;
        }

        return {
            avg: Number(avgFeedback.toFixed(2)),
            selfAssessment
        };
    };

    const fetchData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await fetch(`https://aditya-b.onrender.com/classes/feedback/fdata/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const res = await response.json();

            if (res.success) {
                setData(res.data);

                // Calculate overall averages when data is fetched
                const { avg, selfAssessment } = calculateAverages(res.data);
                setOverallAverage(avg);
                setOverallSelfAssessment(selfAssessment);
            } else {
                console.error("Unexpected API response format:", res);
                setData([]);
                setOverallAverage(0);
                setOverallSelfAssessment(0);
            }
        } catch (error) {
            console.error('Error occurred while fetching data:', error);
        }
    };

    useEffect(() => {
        if (feedbackData && feedbackData.length > 0) {
            setData(feedbackData);

            // Calculate overall averages when data changes
            const { avg, selfAssessment } = calculateAverages(feedbackData);
            setOverallAverage(avg);
            setOverallSelfAssessment(selfAssessment);
        } else {
            fetchData();
        }
    }, [feedbackData]);

    const handleUpdateClick = (feedback) => {
        setShowEditForm(true);
        setShowAddForm(false);
        setSelectedFeedback(feedback);
        setFormData(feedback);
    };

    const handleAddClick = () => {
        setFormData({
            courseName: '',
            semester: '',
            numberOfStudents: 0,
            feedbackPercentage: 0,
            averagePercentage: 0
        });
        setShowAddForm(true);
        setShowEditForm(false);
    };

    const calculateAverageFeedback = (currentFeedback) => {
        if (!data || data.length === 0) {
            return currentFeedback; // If no existing data, return current feedback
        }

        // Sum up all existing feedback percentages
        const totalExisting = data.reduce((sum, item) =>
            sum + Number(item.feedbackPercentage), 0);

        // Calculate new average including current feedback
        return Number(((totalExisting + Number(currentFeedback)) / (data.length + 1)).toFixed(2));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData };

        // Update the current field
        if (name === 'courseName' || name === 'semester') {
            newFormData[name] = value;
        } else {
            newFormData[name] = Number(value) || 0;
        }

        // Calculate values when numberOfStudents or passCount changes
        if (name === 'numberOfStudents' || name === 'passCount') {
            const students = Number(newFormData.numberOfStudents);
            const passed = Number(newFormData.passCount);

            // Validate passCount cannot be greater than numberOfStudents
            if (name === 'passCount' && passed > students) {
                newFormData.passCount = students;
            }

            // Calculate feedback percentage
            if (students > 0) {
                const feedbackPercent = (passed / students) * 100;
                newFormData.feedbackPercentage = Number(feedbackPercent.toFixed(2));

                // Calculate average feedback
                newFormData.averagePercentage = calculateAverageFeedback(feedbackPercent);
            } else {
                newFormData.feedbackPercentage = 0;
                newFormData.averagePercentage = 0;
            }
        }

        console.log('Updated form data:', newFormData); // Debug log
        setFormData(newFormData);
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        const response = await fetch(`https://aditya-b.onrender.com/classes/feedback/${selectedFeedback._id}?userId=${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (result.success) {
            toast.success("Feedback updated successfully");
            setShowEditForm(false);
            fetchData(); // This will recalculate the averages
        } else {
            toast.error("Failed to update feedback");
        }
    };

    const handleAddFormSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');

        // Calculate feedback percentage from passCount
        const students = Number(formData.numberOfStudents);
        const passed = Number(formData.passCount);
        const feedbackPercent = students > 0 ? ((passed / students) * 100).toFixed(2) : 0;

        // Prepare payload matching the schema
        const payload = {
            courseName: formData.courseName,
            semester: formData.semester,
            numberOfStudents: Number(formData.numberOfStudents),
            feedbackPercentage: Number(feedbackPercent),
            averagePercentage: Number(formData.averagePercentage)
        };

        try {
            const response = await fetch(`https://aditya-b.onrender.com/classes/feedback/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                setData([...data, result.feedback]);
                setShowAddForm(false);
                fetchData();
                toast.success('Feedback added successfully');
            } else {
                toast.error('Failed to add feedback');
            }
        } catch (error) {
            console.error('Error adding feedback:', error);
            toast.error('Failed to add feedback');
        }
    };

    const handleDelete = async (id) => {
        const userId = localStorage.getItem('userId');

        if (!id) {
            console.error('Feedback ID is undefined');
            return;
        }
        const response = await fetch(`https://aditya-b.onrender.com/classes/feedback/${id}?userId=${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (data.success) {
            toast.success("Feedback deleted successfully");
            fetchData();
        } else {
            toast.error("Failed to delete feedback");
        }
    };

    return (
        <div>
            <ToastContainer />
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', marginBottom: '20px' }}>
                <button
                    onClick={handleAddClick}
                    className='add-feedback-button no-print'
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
                    <FaPlus /> Add Feedback
                </button>
            </div>

            <table className="courses-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Sem-Branch-Sec</th>
                        <th>Course Name</th>
                        <th>No. of students</th>
                        <th>Feedback %</th>
                        <th>Average %</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ? (
                        data.map((feedback, index) => (
                            <tr key={feedback._id || index}>
                                <td>{index + 1}</td>
                                <td>{feedback.semester}</td>
                                <td>{feedback.courseName}</td>
                                <td>{feedback.numberOfStudents}</td>
                                <td>{feedback.feedbackPercentage}</td>

                                {/* Display the common average only in the first row */}
                                {index === 0 && (
                                    <>
                                        <td rowSpan={data.length}>{overallAverage}</td>
                                        <td rowSpan={data.length}>{overallSelfAssessment}</td>
                                    </>
                                )}

                                <td style={{ display: 'flex', justifyContent: 'center' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={() => handleUpdateClick(feedback)}
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
                                            className='no-print'
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e67528"}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1a4b88"}
                                        >
                                            <FaEdit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(feedback._id)}
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
                                            className='no-print'
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#c0392b"}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#e74c3c"}
                                        >
                                            <FaTrash size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center' }}>No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
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
                            <h2 style={{ margin: 0, color: '#333' }}>Update Feedback</h2>
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
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Course Name</label>
                                    <input
                                        type='text'
                                        name='courseName'
                                        value={formData.courseName}
                                        onChange={handleInputChange}
                                        placeholder='Course Name'
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
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Semester</label>
                                    <input
                                        type='text'
                                        name='semester'
                                        value={formData.semester}
                                        onChange={handleInputChange}
                                        placeholder='Semester'
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
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Number of Students</label>
                                    <input
                                        type='number'
                                        name='numberOfStudents'
                                        value={formData.numberOfStudents}
                                        onChange={handleInputChange}
                                        placeholder='Number of Students'
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
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Feedback Percentage</label>
                                    <input
                                        type='number'
                                        name='feedbackPercentage'
                                        value={formData.feedbackPercentage}
                                        onChange={handleInputChange}
                                        placeholder='Feedback Percentage'
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
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Average Percentage (Auto-calculated)</label>
                                    <input
                                        type='number'
                                        name='averagePercentage'
                                        value={formData.averagePercentage || ''}
                                        readOnly
                                        placeholder='Average Percentage (Auto-calculated)'
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
                            </div>

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
                            <h2 style={{ margin: 0, color: '#333' }}>Add Feedback</h2>
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
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Course Name</label>
                                    <input
                                        type='text'
                                        name='courseName'
                                        value={formData.courseName}
                                        onChange={handleInputChange}
                                        placeholder='Course Name'
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
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Semester</label>
                                    <input
                                        type='text'
                                        name='semester'
                                        value={formData.semester}
                                        onChange={handleInputChange}
                                        placeholder='Semester'
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
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Number of Students</label>
                                    <input
                                        type='number'
                                        name='numberOfStudents'
                                        value={formData.numberOfStudents}
                                        onChange={handleInputChange}
                                        placeholder='Number of Students'
                                        min="0"
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
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Pass Count</label>
                                    <input
                                        type='number'
                                        name='passCount'
                                        value={formData.passCount}
                                        onChange={handleInputChange}
                                        placeholder='Pass Count'
                                        min="0"
                                        max={formData.numberOfStudents}
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

                                <div className="calculated-values" style={{
                                    marginTop: '10px',
                                    backgroundColor: '#f8f9fa',
                                    padding: '12px',
                                    borderRadius: '5px',
                                    border: '1px solid #eee'
                                }}>
                                    <p style={{ margin: '5px 0', fontWeight: '500' }}>Feedback Percentage: <span style={{ color: '#1a4b88' }}>{formData.feedbackPercentage}%</span></p>
                                    <p style={{ margin: '5px 0', fontWeight: '500' }}>Average Percentage: <span style={{ color: '#1a4b88' }}>{formData.averagePercentage}%</span></p>
                                </div>
                            </div>

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
                                    Add Feedback
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DisplayFeedback;
