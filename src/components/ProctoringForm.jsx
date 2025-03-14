import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const ProctoringForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        totalStudents: "",
        semesterBranchSec: "",
        eligibleStudents: "",
        passedStudents: "",
    });

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:5000/fetchData", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setFormData((prevData) => ({
                        ...prevData,
                        teacher: data.id,
                    }));
                } else {
                    console.error("Failed to fetch user ID");
                }
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        };

        fetchUserId();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:5000/proc/proctoring-data",
                formData,
                {
                    credentials: "include",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Proctoring data submitted successfully:", response.data);
            navigate("/partb");
        } catch (error) {
            console.error("Error submitting proctoring data:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="number" name="totalStudents" value={formData.totalStudents} onChange={handleChange} placeholder="Total Students" required />
            <input type="text" name="semesterBranchSec" value={formData.semesterBranchSec} onChange={handleChange} placeholder="Sem-Branch-Sec" required />
            <input type="number" name="eligibleStudents" value={formData.eligibleStudents} onChange={handleChange} placeholder="Eligible Students" required />
            <input type="number" name="passedStudents" value={formData.passedStudents} onChange={handleChange} placeholder="Passed Students" required />
            <button type="submit">Submit</button>
        </form>
    );
};

export default ProctoringForm;
