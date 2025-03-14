import React, { useEffect, useState } from "react";
import Navbar from './Navbar';
import Footer from "./Footer";
const UserList = () => {
    const [users, setUsers] = useState({});
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:5000/users");
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://localhost:5000/users/${editingUser}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                fetchUsers();
                setEditingUser(null);
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    return (
        <>
     
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-4 text-center">Admin Panel</h2>
            <div className="space-y-6">
                {Object.keys(users).map((group, index) => {
                    const isHOD = group.toLowerCase().includes("hod"); // Check if it's an HOD section
                    const bgColor = isHOD ? "bg-blue-100 border-blue-400" : "bg-gray-100 border-gray-400"; // Different colors for better distinction

                    return (
                        <div key={index} className={`border-l-4 ${bgColor} shadow-lg p-4 rounded-lg`}>
                            <h3 className={`text-lg font-semibold ${isHOD ? "text-blue-700" : "text-gray-700"} pb-2`}>
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
                                        <button
                                            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1 rounded"
                                            onClick={() => handleEdit(user)}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
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
                        <div className="flex justify-end space-x-2 mt-4">
                            <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Update</button>
                            <button onClick={() => setEditingUser(null)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <Footer/>
        </>
    );
};

export default UserList;
