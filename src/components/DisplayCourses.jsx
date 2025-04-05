import React, { useEffect, useState } from 'react';
import './DisplayCourses.css';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';

const DisplayCourses = ({ coursesData }) => {
    const [data, setData] = useState(coursesData || []);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        courseName: '',
        semester: '',
        numberOfStudents: '',
        passCount: ''
    });

    const fetchData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await fetch(`https://aditya-b.onrender.com/classes/courses/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const res = await response.json();
            if (res.success) {
                setData(res.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch data');
        }
    };

    useEffect(() => {
        if (coursesData) {
            setData(coursesData);
        } else {
            fetchData();
        }
    }, [coursesData]);

    const handleRowSelect = (course) => {
        setSelectedCourse(course);
        setShowEditForm(false);
    };

    const handleDelete = async (id) => {
        const userId = localStorage.getItem('userId');
        if (!id) {
            console.error('Course ID is undefined');
            return;
        }
        try {
            const response = await fetch(`https://aditya-b.onrender.com/classes/courses/${id}?userId=${userId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                setData(data.filter((course) => course._id !== id));
                toast.success('Course deleted successfully');
                fetchData();
            }
        } catch (error) {
            toast.error('Failed to delete course');
            console.error('Error deleting course:', error);
            toast.error('An error occurred while deleting the course. Please try again.');
        }
    };

    const handleEditClick = (course) => {
        setSelectedCourse(course);
        setFormData(course);
        setShowEditForm(true);
        setShowAddForm(false);
    };

    const handleAddClick = () => {
        setFormData({
            courseName: '',
            semester: '',
            numberOfStudents: '',
            passCount: ''
        });
        setShowAddForm(true);
        setShowEditForm(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEditFormSubmit = async (e) => {
        const userId = localStorage.getItem('userId');
        e.preventDefault();
        try {
            const response = await fetch(`https://aditya-b.onrender.com/classes/courses/${selectedCourse._id}?userId=${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const res = await response.json();
            if (res.success) {
                const updatedCourse = res.data;
                // Update the course in the existing state
                setData((prevData) =>
                    prevData.map((course) =>
                        course._id === updatedCourse._id ? updatedCourse : course
                    )
                );

                setShowEditForm(false); // Close the form after successful update
                setSelectedCourse(null); // Clear the selection
                toast.success('Course updated successfully');
                fetchData();
            } else {
                toast.error('Failed to update course');
            }
        } catch (error) {
            console.error('Error updating course:', error);
            toast.error('Failed to update course');
        }
    };

    const handleAddFormSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`https://aditya-b.onrender.com/classes/courses/addclass/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const newCourse = await response.json();
                setData([...data, newCourse]);
                fetchData();
                setShowAddForm(false);
                toast.success('Course added successfully');
            } else {
                toast.error('Failed to add course');
            }
        } catch (error) {
            console.error('Error adding course:', error);
            toast.error('Failed to add course');
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

            {/* Add Course button in the top right */}
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                margin: '20px 0'
            }}>
                <button
                    onClick={handleAddClick}
                    className='add-course-button no-print'
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
                    <FaPlus /> Add Course
                </button>
            </div>

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
                                        <td rowSpan={data && data.length}>{averagePassPercentage}</td>
                                        <td rowSpan={data && data.length}>{selfAssessmentMarks}</td>
                                    </>
                                )}

                                {(
                                    <td style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleEditClick(course); }}
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
                                            onClick={(e) => { e.stopPropagation(); handleDelete(course._id); }}
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
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan='9' style={{ textAlign: 'center' }}>
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

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
                            <h2 style={{ margin: 0, color: '#333' }}>Add Course</h2>
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

                        {/* Vertically stacked form fields */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Course Name</label>
                                <input
                                    type='text'
                                    name='courseName'
                                    value={formData.courseName}
                                    onChange={handleInputChange}
                                    placeholder='Enter course name'
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
                                    placeholder='Enter semester'
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
                                    placeholder='Enter number of students'
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
                                    placeholder='Enter pass count'
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
                                onClick={() => setShowAddForm(false)}
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
                                onClick={handleAddFormSubmit}
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
                                Add Course
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Similar modal for Edit form */}
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
                    <div className='edit-form' style={{
                        backgroundColor: 'white',
                        padding: '25px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        width: '90%',
                        maxWidth: '500px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#333' }}>Edit Course</h2>
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

                        {/* Vertically stacked form fields for Edit */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Course Name</label>
                                <input
                                    type='text'
                                    name='courseName'
                                    value={formData.courseName}
                                    onChange={handleInputChange}
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

                        {/* Side by side buttons for Edit */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '15px' }}>
                            <button
                                onClick={() => setShowEditForm(false)}
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
                                onClick={handleEditFormSubmit}
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default DisplayCourses;