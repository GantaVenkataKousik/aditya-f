import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from "./Footer";
import LoginStatisticsChart from "./LoginStatisticsChart";
import { FaEdit, FaEye, FaTrash, FaHome, FaDownload } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const UserList = () => {
    const [users, setUsers] = useState({});
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch("https://aditya-b.onrender.com/users");
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user._id);
        setFormData(user);
    };

    const handleDelete = async (userId, userName) => {
        if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
            try {
                const response = await fetch(`https://aditya-b.onrender.com/delete-user/${userId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                if (response.ok) {
                    // Re-fetch users to update UI
                    fetchUsers();
                    toast.success(`${userName} deleted successfully`, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                } else {
                    toast.error("Failed to delete user", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
            } catch (error) {
                console.error("Error deleting user:", error);
                toast.error("Error occurred while deleting user", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`https://aditya-b.onrender.com/users/${editingUser}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                fetchUsers();
                setEditingUser(null);
                toast.success("User updated successfully");
            } else {
                toast.error("Failed to update user");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Error occurred while updating user");
        }
    };

    const downloadPDF = () => {
        const input = document.getElementById('contentToDownload');
        if (!input) {
            console.error('Element with id "contentToDownload" not found.');
            return;
        }

        // Hide all elements with class "no-print" before capturing
        const noPrintElements = input.querySelectorAll('.no-print');
        noPrintElements.forEach(el => {
            el.style.display = 'none';
        });

        html2canvas(input, {
            scale: 2,
            ignoreElements: element => element.classList.contains('no-print')
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            const currentDate = new Date().toISOString().split('T')[0];
            pdf.save(`admin_report_${currentDate}.pdf`);

            // Restore visibility after PDF generation
            noPrintElements.forEach(el => {
                el.style.display = '';
            });
        }).catch((error) => {
            console.error('Error generating PDF:', error);
            // Restore visibility even if there's an error
            noPrintElements.forEach(el => {
                el.style.display = '';
            });
        });
    };

    return (
        <>
            <div id="contentToDownload" className="p-6 bg-gray-100 min-h-screen font-poppins">
                <ToastContainer />

                {/* Home button and header */}
                <div className="flex items-center mb-4">
                    <div
                        className='home-button no-print'
                        onClick={() => navigate('/home')}
                        style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: '#1a4b88',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '22px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#ff7f27';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#1a4b88';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <FaHome />
                    </div>
                    <h2 className="text-2xl font-bold ml-4 flex-1 text-center">Admin Panel</h2>

                    {/* Print button */}
                    <button
                        onClick={downloadPDF}
                        className="no-print bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center transition-colors duration-200"
                    >
                        <FaDownload className="mr-2" /> Print Report
                    </button>
                </div>

                {/* Add Login Statistics Chart */}
                <LoginStatisticsChart />

                <h2 className="text-2xl font-bold mb-4 text-center">User List</h2>
                <div className="space-y-6">
                    {Object.keys(users).map((group, index) => {
                        const isHOD = group.toLowerCase().includes("hod");
                        const bgColor = isHOD ? "bg-orange-50 border-orange-300" : "bg-gray-100 border-gray-400";

                        return (
                            <div key={index} className={`border-l-4 ${bgColor} shadow-lg p-4 rounded-lg`}>
                                <h3 className={`text-lg font-semibold ${isHOD ? "text-[#e67528]" : "text-gray-700"} pb-2`}>
                                    {group}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                    {users[group].map((user) => (
                                        <div key={user._id} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-gray-300">
                                            <p className="text-lg font-semibold">{user.fullName}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                            <p className="text-sm text-gray-500">Emp ID: {user.EmpID || "N/A"}</p>
                                            <p className="text-sm text-gray-500">Joining: {user.JoiningDate || "N/A"}</p>
                                            <p className="text-sm text-gray-500">Qualification: {user.Qualification || "N/A"}</p>

                                            <div className="mt-4 flex justify-end gap-2 no-print">
                                                <Link to={`/details/${user._id}`}>
                                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded transition-colors duration-200">
                                                        <FaEye />
                                                    </button>
                                                </Link>

                                                <Link to={`/details/${user._id}`}>
                                                    <button className="bg-[#e67528] hover:bg-[#d56a24] text-white px-3 py-1.5 rounded transition-colors duration-200">
                                                        <FaEdit />
                                                    </button>
                                                </Link>

                                                <button
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded transition-colors duration-200"
                                                    onClick={() => handleDelete(user._id, user.fullName)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Edit Modal with no-print class */}
                {editingUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center no-print">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                            <h3 className="text-lg font-semibold mb-4">Edit User</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" name="fullName" value={formData.fullName || ""} onChange={handleChange} className="border p-2 rounded" placeholder="Full Name" />
                                <input type="text" name="email" value={formData.email || ""} onChange={handleChange} className="border p-2 rounded" placeholder="Email" />
                                <input type="text" name="designation" value={formData.designation || ""} onChange={handleChange} className="border p-2 rounded" placeholder="Designation" />
                                <input type="text" name="department" value={formData.department || ""} onChange={handleChange} className="border p-2 rounded" placeholder="Department" />
                                <input type="text" name="EmpID" value={formData.EmpID || ""} onChange={handleChange} className="border p-2 rounded" placeholder="Emp ID" />
                                <input type="text" name="JoiningDate" value={formData.JoiningDate || ""} onChange={handleChange} className="border p-2 rounded" placeholder="Joining Date" />
                                <input type="text" name="Qualification" value={formData.Qualification || ""} onChange={handleChange} className="border p-2 rounded" placeholder="Qualification" />
                                <input type="text" name="YearOfpass" value={formData.YearOfpass || ""} onChange={handleChange} className="border p-2 rounded" placeholder="Year of Passing" />
                                <input type="text" name="UG" value={formData.UG || ""} onChange={handleChange} className="border p-2 rounded" placeholder="UG" />
                                <input type="text" name="UGYear" value={formData.UGYear || ""} onChange={handleChange} className="border p-2 rounded" placeholder="UG Year" />
                                <input type="text" name="PG" value={formData.PG || ""} onChange={handleChange} className="border p-2 rounded" placeholder="PG" />
                                <input type="text" name="PGYear" value={formData.PGYear || ""} onChange={handleChange} className="border p-2 rounded" placeholder="PG Year" />
                                <input type="text" name="Phd" value={formData.Phd || ""} onChange={handleChange} className="border p-2 rounded" placeholder="PhD" />
                                <input type="text" name="PhdYear" value={formData.PhdYear || ""} onChange={handleChange} className="border p-2 rounded" placeholder="PhD Year" />
                                <input type="text" name="Industry" value={formData.Industry || ""} onChange={handleChange} className="border p-2 rounded" placeholder="Industry" />
                                <input type="number" name="TExp" value={formData.TExp || ""} onChange={handleChange} className="border p-2 rounded" placeholder="Total Experience" />
                            </div>
                            <div className="flex justify-end space-x-2 mt-4 no-print">
                                <button onClick={handleUpdate} className="bg-[#e67528] text-white px-4 py-2 rounded hover:bg-[#d56a24]">Update</button>
                                <button onClick={() => setEditingUser(null)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default UserList;
