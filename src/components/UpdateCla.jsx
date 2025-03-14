import React, { useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

// ... existing imports ...

const UpdateCla = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        courseName: '',
        semester: '',
        numberOfStudents: '',
        feedbackpercent: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/update/feedback', formData, {
                credentials: 'include', 
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Feedback updated successfully:', response.data);
            navigate('/classes')
        } catch (error) {
            console.error('Error updating class:', error);
        }
    };


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="courseName" value={formData.courseName} onChange={handleChange} placeholder="Course Name" required />
                <input type="text" name="semester" value={formData.semester} onChange={handleChange} placeholder="Semester-Branch-sec" required />
                <input type="number" name="numberOfStudents" value={formData.numberOfStudents} onChange={handleChange} placeholder="Number of Students Appeared" required />
                <input type="number" name="feedbackpercent" value={formData.feedbackpercent} onChange={handleChange} placeholder="Feedback Percentage" required />
                <button type="submit">Submit</button>
            </form>
            {/* ... existing table or other components ... */}
        </div>
    );
};

// ... existing code ...
export default UpdateCla;