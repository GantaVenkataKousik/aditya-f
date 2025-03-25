import React, { useEffect, useState } from 'react';
import './DisplayCourses.css'; // Import the CSS file
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DisplayFeedback = ({ feedbackData }) => {
    const [data, setData] = useState(feedbackData || []);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [canModify, setCanModify] = useState(false);
    const [formData, setFormData] = useState({
        courseName: '',
        semester: '',
        numberOfStudents: 0,
        feedbackPercentage: 0,
        averagePercentage: 0,
        selfAssessmentMarks: 0
    });

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
            } else {
                console.error("Unexpected API response format:", res);
                setData([]);
            }

        } catch (error) {
            console.error('Error occurred while fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
        const role = localStorage.getItem('role');
        if (role === 'admin' || role === 'Faculty') {
            setCanModify(true);
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
            averagePercentage: 0,
            selfAssessmentMarks: 0
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

                // Set self assessment marks based on feedback percentage
                if (feedbackPercent >= 90) {
                    newFormData.selfAssessmentMarks = 10;
                } else if (feedbackPercent >= 80) {
                    newFormData.selfAssessmentMarks = 8;
                } else if (feedbackPercent >= 70) {
                    newFormData.selfAssessmentMarks = 6;
                } else {
                    newFormData.selfAssessmentMarks = 4;
                }
            } else {
                newFormData.feedbackPercentage = 0;
                newFormData.averagePercentage = 0;
                newFormData.selfAssessmentMarks = 4;
            }
        }

        console.log('Updated form data:', newFormData); // Debug log
        setFormData(newFormData);
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        const response = await fetch(`https://aditya-b.onrender.com/classes/feedback/${selectedFeedback._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (data.success) {
            toast.success("Feedback updated successfully");
            setShowEditForm(false);
            fetchData();
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
            averagePercentage: Number(formData.averagePercentage),
            selfAssessmentMarks: Number(formData.selfAssessmentMarks)
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
        if (!id) {
            console.error('Feedback ID is undefined');
            return;
        }
        const response = await fetch(`https://aditya-b.onrender.com/classes/feedback/${id}`, {
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
            <div className='add-feedback-button-container' style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', marginTop: '20px' }}>
                {canModify && (
                    <button onClick={handleAddClick} className='add-feedback-button' style={{ color: 'white', border: 'none', borderRadius: '5px', padding: '10px', cursor: 'pointer', width: '200px', height: '40px' }}>Add Feedback</button>
                )}
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
                        <th>Self-Assessment Marks</th>
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
                                <td>{feedback.averagePercentage}</td>
                                <td>{feedback.selfAssessmentMarks}</td>
                                <td style={{ display: 'flex', justifyContent: 'center' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => handleUpdateClick(feedback)} style={{ width: 'auto' }}>
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => handleDelete(feedback._id)} style={{ width: 'auto', backgroundColor: 'red', color: 'white' }}>
                                            <FaTrash />
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
                <div className='update-form'>
                    <h2>Update Feedback</h2>
                    <form onSubmit={handleEdit}>
                        <input type='text' name='courseName' value={formData.courseName} onChange={handleInputChange} placeholder='Course Name' required />
                        <input type='text' name='semester' value={formData.semester} onChange={handleInputChange} placeholder='Semester' required />
                        <input type='number' name='numberOfStudents' value={formData.numberOfStudents} onChange={handleInputChange} placeholder='Number of Students' required />
                        <input type='number' name='feedbackPercentage' value={formData.feedbackPercentage} onChange={handleInputChange} placeholder='Feedback Percentage' required />
                        <input
                            type='number'
                            name='averagePercentage'
                            value={formData.averagePercentage || ''}
                            readOnly
                            placeholder='Average Percentage (Auto-calculated)'
                            style={{ backgroundColor: '#f0f0f0' }}
                        />
                        <input type='number' name='selfAssessmentMarks' value={formData.selfAssessmentMarks} onChange={handleInputChange} placeholder='Self-Assessment Marks' required />
                        <button type='submit' className='no-print'>Save Changes</button>
                        <button type='button' onClick={() => setShowEditForm(false)} className='no-print'>Cancel</button>
                    </form>
                </div>
            )}
            {showAddForm && (
                <div className='add-form'>
                    <h2>Add Feedback</h2>
                    <form onSubmit={handleAddFormSubmit}>
                        <input
                            type='text'
                            name='courseName'
                            value={formData.courseName}
                            onChange={handleInputChange}
                            placeholder='Course Name'
                            required
                        />
                        <input
                            type='text'
                            name='semester'
                            value={formData.semester}
                            onChange={handleInputChange}
                            placeholder='Semester'
                            required
                        />
                        <input
                            type='number'
                            name='numberOfStudents'
                            value={formData.numberOfStudents}
                            onChange={handleInputChange}
                            placeholder='Number of Students'
                            min="0"
                            required
                        />
                        <input
                            type='number'
                            name='passCount'
                            value={formData.passCount}
                            onChange={handleInputChange}
                            placeholder='Pass Count'
                            min="0"
                            max={formData.numberOfStudents}
                            required
                        />
                        <div className="calculated-values" style={{ marginTop: '10px' }}>
                            <p>Feedback Percentage: {formData.feedbackPercentage}%</p>
                            <p>Average Percentage: {formData.averagePercentage}%</p>
                            <p>Self-Assessment Marks: {formData.selfAssessmentMarks}</p>
                        </div>
                        {canModify && (
                            <button type='submit' className='no-print'>Add Feedback</button>
                        )}
                        <button type='button' onClick={() => setShowAddForm(false)} className='no-print'>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default DisplayFeedback;
