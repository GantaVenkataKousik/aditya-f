import React, { useState, useEffect } from 'react';
import './UpdateClass.css';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

const UpdateClass = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        courseName: '',
        semester: '',
        numberOfStudents: '',
        passCount: '',
        teacher: ''
    });

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await fetch(`https://aditya-b.onrender.com/fetchData?userId=${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setFormData((prevData) => ({
                        ...prevData,
                        teacher: data.id
                    }));
                } else {
                    console.error('Failed to fetch user ID');
                }
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        fetchUserId();
    }, []);

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
            const response = await axios.put(`https://aditya-b.onrender.com/classes/${classId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Class updated successfully:', response.data);
            navigate('/classes')
        } catch (error) {
            console.error('Error updating class:', error);
        }
    };



    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="courseName" value={formData.courseName} onChange={handleChange} placeholder="Course Name" required />
            <input type="text" name="semester" value={formData.semester} onChange={handleChange} placeholder="Semester-Branch-sec" required />

            <input type="number" name="numberOfStudents" value={formData.numberOfStudents} onChange={handleChange} placeholder="Number of Students Appeared" required />

            <input type="number" name="passCount" value={formData.passCount} onChange={handleChange} placeholder="Pass Count" required />
            <button type="submit">Update Class</button>
        </form>
    );
};

export default UpdateClass;
