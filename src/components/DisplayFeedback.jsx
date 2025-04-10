import React, { useEffect, useState } from 'react';
import './DisplayCourses.css'; // Import the CSS file
import { FaEdit, FaTrash, FaPlus, FaTimes, FaHistory } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { backendUrl } from '../../routes';
const DisplayFeedback = ({ feedbackData }) => {
    const [data, setData] = useState(feedbackData || []);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [formData, setFormData] = useState({
        courseName: '',
        semester: '',
        numberOfStudents: '',
        feedbackPercentage: '',
        averagePercentage: '',
        passCount: ''
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
            const response = await fetch(`${backendUrl}/classes/feedback/fdata/${userId}`, {
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
            numberOfStudents: '',
            feedbackPercentage: '',
            averagePercentage: '',
            passCount: ''
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

        // Log the change event
        console.log(`Field ${name} changing to value: ${value}`);

        // Create a copy of form data
        const newFormData = { ...formData };

        // Handle field value based on input type
        if (name === 'courseName' || name === 'semester') {
            // Text fields - store as is
            newFormData[name] = value;
        } else if (name === 'feedbackPercentage') {
            // Direct edit of feedback percentage
            const numValue = value === '' ? '' : Number(value);
            newFormData.feedbackPercentage = numValue;

            // If this is a valid number, update self-assessment marks
            if (!isNaN(numValue) && numValue !== '') {
                if (numValue >= 90) newFormData.selfAssessmentMarks = 10;
                else if (numValue >= 80) newFormData.selfAssessmentMarks = 8;
                else if (numValue >= 70) newFormData.selfAssessmentMarks = 6;
                else newFormData.selfAssessmentMarks = 4;
            }
        } else {
            // Number fields
            newFormData[name] = value === '' ? '' : Number(value);

            // If we're changing numberOfStudents or passCount, recalculate the feedback percentage
            if ((name === 'numberOfStudents' || name === 'passCount') &&
                newFormData.numberOfStudents && newFormData.passCount) {

                const students = Number(newFormData.numberOfStudents);
                const passed = Number(newFormData.passCount);

                if (students > 0) {
                    const feedbackPercent = (passed / students) * 100;
                    newFormData.feedbackPercentage = Number(feedbackPercent.toFixed(2));

                    // Update self assessment marks too
                    if (feedbackPercent >= 90) newFormData.selfAssessmentMarks = 10;
                    else if (feedbackPercent >= 80) newFormData.selfAssessmentMarks = 8;
                    else if (feedbackPercent >= 70) newFormData.selfAssessmentMarks = 6;
                    else newFormData.selfAssessmentMarks = 4;
                }
            }
        }

        // Log the updated form data
        console.log('Updated form data:', newFormData);

        // Update state
        setFormData(newFormData);
    };

    const handleEdit = async (e) => {
        e.preventDefault();

        try {
            const userId = localStorage.getItem('userId');

            // Make sure the form data is properly formatted with correct types
            const payload = {
                courseName: formData.courseName,
                semester: formData.semester,
                numberOfStudents: Number(formData.numberOfStudents),
                feedbackPercentage: Number(formData.feedbackPercentage),
                averagePercentage: Number(formData.averagePercentage),
                selfAssessmentMarks: Number(formData.selfAssessmentMarks || 0),
            };

            // Log what we're sending to the server
            console.log("Sending update payload:", payload);

            const response = await fetch(`${backendUrl}/classes/feedback/${selectedFeedback._id}?userId=${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            // Log the entire response for debugging
            const responseText = await response.text();
            console.log("Raw response:", responseText);

            let result;
            try {
                // Try to parse the response as JSON
                result = JSON.parse(responseText);
            } catch (err) {
                console.error("Failed to parse response as JSON:", err);
                toast.error("Server returned an invalid response");
                return;
            }

            if (response.ok && result.success) {
                toast.success("Feedback updated successfully");
                setShowEditForm(false);
                fetchData(); // Refresh the data
            } else {
                // Show a detailed error message
                toast.error(result.message || "Failed to update feedback");
                console.error("Update failed:", result);
            }
        } catch (error) {
            console.error("Error in handleEdit:", error);
            toast.error(`Error: ${error.message}`);
        }
    };

    const handleAddFormSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');

        // Calculate feedback percentage from passCount
        const students = Number(formData.numberOfStudents);
        const passed = Number(formData.passCount);
        const feedbackPercent = students > 0 ? ((passed / students) * 100).toFixed(2) : 0;

        // Calculate self-assessment marks based on feedback percentage
        let selfAssessment = 4; // default value
        const feedbackPercentNumber = Number(feedbackPercent);
        if (feedbackPercentNumber >= 90) {
            selfAssessment = 10;
        } else if (feedbackPercentNumber >= 80) {
            selfAssessment = 8;
        } else if (feedbackPercentNumber >= 70) {
            selfAssessment = 6;
        }

        // Prepare payload matching the schema
        const payload = {
            courseName: formData.courseName,
            semester: formData.semester,
            numberOfStudents: Number(formData.numberOfStudents),
            feedbackPercentage: Number(feedbackPercent),
            averagePercentage: Number(formData.averagePercentage),
            selfAssessmentMarks: Number(selfAssessment) // Include this value
        };

        console.log("Sending feedback data:", payload); // Debug log to verify payload

        try {
            const response = await fetch(`${backendUrl}/classes/feedback/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log("Server response:", result); // Debug log to see response

            if (response.ok && result.success) {
                setData([...data, result.feedback]);
                setShowAddForm(false);
                fetchData();
                toast.success('Feedback added successfully');
            } else {
                toast.error(result.error || 'Failed to add feedback');
                console.error('Error response:', result);
            }
        } catch (error) {
            console.error('Error adding feedback:', error);
            toast.error('Failed to add feedback: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        const userId = localStorage.getItem('userId');

        if (!id) {
            console.error('Feedback ID is undefined');
            return;
        }
        const response = await fetch(`${backendUrl}/classes/feedback/${id}?userId=${userId}`, {
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
                                    <p style={{ margin: '5px 0', fontWeight: '500' }}>Self-Assessment Marks: <span style={{ color: '#1a4b88' }}>
                                        {formData.feedbackPercentage >= 90 ? 10 :
                                            formData.feedbackPercentage >= 80 ? 8 :
                                                formData.feedbackPercentage >= 70 ? 6 : 4}
                                    </span></p>
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
