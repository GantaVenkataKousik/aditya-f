import React, { useEffect, useState } from 'react';
import './DisplayCourses.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
const DisplayCourses = ({ coursesData }) => {
    const [data, setData] = useState(coursesData || []);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        courseName: '',
        semester: '',
        numberOfStudents: '',
        passCount: ''
    });
    const fetchData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await fetch(`https://aditya-b.onrender.com/classes/fdata?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const res = await response.json();
            if (res.success) {
                setData(res.data[0]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch data');
        }
    };
    useEffect(() => {
        fetchData();
    }, [coursesData]);

    const handleRowSelect = (course) => {
        setSelectedCourse(course);
        setShowForm(false);
    };

    const handleDelete = async (id) => {
        if (!id) {
            console.error('Course ID is undefined');
            return;
        }
        try {
            const response = await fetch(`https://aditya-b.onrender.com/classes/courses/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                setData(data.filter((course) => course._id !== id));
                toast.success('Course deleted successfully');
            }
        } catch (error) {
            toast.error('Failed to delete course');
            console.error('Error deleting course:', error);
            toast.error('An error occurred while deleting the course. Please try again.');
        }
    };

    const handleUpdateClick = (course) => {
        setSelectedCourse(course);
        setFormData(course);
        setShowForm(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://aditya-b.onrender.com/classes/courses/${selectedCourse._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedCourse = await response.json();

                // Update the course in the existing state
                setData((prevData) =>
                    prevData.map((course) =>
                        course._id === updatedCourse._id ? updatedCourse : course
                    )
                );

                setShowForm(false); // Close the form after successful update
                setSelectedCourse(null); // Clear the selection
                toast.success('Course updated successfully');
            } else {
                toast.error('Failed to update course');
            }
        } catch (error) {
            console.error('Error updating course:', error);
            toast.error('Failed to update course');
        }
    };


    // **Calculate average pass percentage and self-assessment marks**
    const totalPassPercentage = data && data.length > 0 ? data.reduce((acc, cls) => acc + cls.passPercentage, 0) : 0;
    const averagePassPercentage = data && data.length > 0 ? (totalPassPercentage / data.length).toFixed(2) : 0;

    let selfAssessmentMarks = 0;
    if (averagePassPercentage >= 95) {
        selfAssessmentMarks = 20;
    } else if (averagePassPercentage >= 85) {
        selfAssessmentMarks = 15;
    } else {
        selfAssessmentMarks = 10;
    }

    return (
        <div>
            <ToastContainer />
            <table className='courses-table'>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Course Name</th>
                        <th>Sem-Branch-Sec</th>
                        <th>No. of Students Appeared</th>
                        <th>Passed</th>
                        <th>Pass %</th>
                        <th>Average %</th>
                        <th>Self-Assessment Marks</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ? (
                        data.map((course, index) => (
                            <tr
                                key={course._id || index}
                                onClick={() => handleRowSelect(course)}
                                style={{
                                    backgroundColor: selectedCourse?._id === course._id ? '#f0f0f0' : 'transparent',
                                }}
                            >
                                <td>{index + 1}</td>
                                <td>{course.courseName}</td>
                                <td>{course.semester}</td>
                                <td>{course.numberOfStudents}</td>
                                <td>{course.passCount}</td>
                                <td>{((course.passCount / course.numberOfStudents) * 100).toFixed(2)}%</td>

                                {index === 0 && (
                                    <>
                                        <td rowSpan={data.length}>{averagePassPercentage}</td>
                                        <td rowSpan={data.length}>{selfAssessmentMarks}</td>
                                    </>
                                )}

                                <td style={{ display: 'flex', justifyContent: 'center' }}>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleUpdateClick(course); }}
                                        style={{
                                            fontSize: "16px",
                                            margin: "2px",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            backgroundColor: "rgb(59 130 246)",
                                            color: "white",
                                            transition: "0.3s",
                                            width: "auto"
                                        }}
                                        className='no-print'
                                        onMouseOver={(e) => e.target.style.backgroundColor = "#2980b9"}
                                        onMouseOut={(e) => e.target.style.backgroundColor = "#3498db"}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(course._id); }}
                                        style={{
                                            fontSize: "16px",
                                            padding: "4px 8px",
                                            margin: "2px",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            backgroundColor: "#e74c3c",
                                            color: "white",
                                            transition: "0.3s",
                                            width: "auto"
                                        }}
                                        className='no-print'
                                        onMouseOver={(e) => e.target.style.backgroundColor = "#c0392b"}
                                        onMouseOut={(e) => e.target.style.backgroundColor = "#e74c3c"}
                                    >
                                        <FaTrash />
                                    </button>
                                </td >
                            </tr >
                        ))
                    ) : (
                        <tr>
                            <td colSpan='9' style={{ textAlign: 'center' }}>
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody >
            </table >

            {showForm && (
                <div className='update-form'>
                    <h2>Update Course</h2>
                    <form onSubmit={handleFormSubmit}>
                        <input type='text' name='courseName' value={formData.courseName} onChange={handleInputChange} placeholder='Course Name' required />
                        <input type='text' name='semester' value={formData.semester} onChange={handleInputChange} placeholder='Semester' required />
                        <input type='number' name='numberOfStudents' value={formData.numberOfStudents} onChange={handleInputChange} placeholder='Number of Students' required />
                        <input type='number' name='passCount' value={formData.passCount} onChange={handleInputChange} placeholder='Pass Count' required />
                        <button type='submit'>Save Changes</button>
                        <button type='button' onClick={() => setShowForm(false)}>Cancel</button>
                    </form>
                </div>
            )}
        </div >
    );
};

export default DisplayCourses;