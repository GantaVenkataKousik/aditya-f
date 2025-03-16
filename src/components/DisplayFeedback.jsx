import React, { useEffect, useState } from 'react';
import './DisplayCourses.css'; // Import the CSS file
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DisplayFeedback = ({ feedbackData }) => {
    const [data, setData] = useState(feedbackData || []);
    const [showForm, setShowForm] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [formData, setFormData] = useState({
        courseName: '',
        semester: '',
        numberOfStudents: '',
        passCount: '',
        feedbackPercentage: '',
        averagePercentage: '',
        selfAssessmentMarks: ''
    });

    const fetchData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await fetch(`https://aditya-b.onrender.com/feedback/fdata?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data2 = await response.json();
            console.log("Fetched Data:", data2);

            if (Array.isArray(data2.data)) {
                setData(data2.data);
            } else {
                console.error("Unexpected API response format:", data2);
                setData([]);
            }

        } catch (error) {
            console.error('Error occurred while fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [feedbackData]);

    const handleUpdateClick = (feedback) => {
        setShowForm(true);
        setSelectedFeedback(feedback);
        setFormData(feedback);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
            setShowForm(false);
            fetchData();
        } else {
            toast.error("Failed to update feedback");
        }
    };

    const handleDelete = async (id) => {
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
                    {data.length > 0 ? (
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
            {showForm && (
                <div className='update-form'>
                    <h2>Update Feedback</h2>
                    <form onSubmit={handleEdit}>
                        <input type='text' name='courseName' value={formData.courseName} onChange={handleInputChange} placeholder='Course Name' required />
                        <input type='text' name='semester' value={formData.semester} onChange={handleInputChange} placeholder='Semester' required />
                        <input type='number' name='numberOfStudents' value={formData.numberOfStudents} onChange={handleInputChange} placeholder='Number of Students' required />
                        <input type='number' name='feedbackPercentage' value={formData.feedbackPercentage} onChange={handleInputChange} placeholder='Feedback Percentage' required />
                        <input type='number' name='averagePercentage' value={formData.averagePercentage} onChange={handleInputChange} placeholder='Average Percentage' required />
                        <input type='number' name='selfAssessmentMarks' value={formData.selfAssessmentMarks} onChange={handleInputChange} placeholder='Self-Assessment Marks' required />
                        <button type='submit' className='no-print'>Save Changes</button>
                        <button type='button' onClick={() => setShowForm(false)} className='no-print'>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default DisplayFeedback;
