import React, { useState, useEffect } from 'react';

const TotalMarksDisplay = ({ userId }) => {
    const [totalMarks, setTotalMarks] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTotalMarks = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get userId from props or from localStorage if not provided
                const userIdToUse = userId || localStorage.getItem('userId');

                if (!userIdToUse) {
                    throw new Error('User ID not available');
                }

                // Make API call to get total marks - try a different endpoint
                // Update this URL to match your actual API endpoint
                const response = await fetch(`https://aditya-b.onrender.com/research/getdata?userId=${userIdToUse}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch total marks');
                }

                const data = await response.json();

                // Calculate total from all sources
                let calculatedTotal = 0;

                // Add activities marks (max 10)
                calculatedTotal += localStorage.getItem('outreachmarks') ?
                    Number(localStorage.getItem('outreachmarks')) : 0;

                // Add contributions marks (max 10)
                calculatedTotal += localStorage.getItem('specialmarks') ?
                    Number(localStorage.getItem('specialmarks')) : 0;

                // Add responsibilities marks (max 20)
                calculatedTotal += localStorage.getItem('additionalmarks') ?
                    Number(localStorage.getItem('additionalmarks')) : 0;

                // Add any other component marks stored in localStorage or from API
                // If there's research data coming from the API
                if (data && Array.isArray(data)) {
                    const researchTotal = data.reduce((sum, item) =>
                        sum + (item.obtained_score && !isNaN(Number(item.obtained_score)) ?
                            Number(item.obtained_score) : 0), 0);
                    calculatedTotal += researchTotal;
                }

                setTotalMarks(calculatedTotal);
            } catch (error) {
                console.error('Error fetching total marks:', error);
                setError(error.message);

                // Fallback calculation - try to gather data from localStorage
                try {
                    let calculatedTotal = 0;

                    // Add marks from various sources in localStorage
                    calculatedTotal += Number(localStorage.getItem('outreachmarks') || 0);
                    calculatedTotal += Number(localStorage.getItem('specialmarks') || 0);
                    calculatedTotal += Number(localStorage.getItem('additionalmarks') || 0);

                    // Try to add others if available in localStorage
                    // You can add more localStorage items here if needed

                    setTotalMarks(calculatedTotal);
                } catch (calcError) {
                    setError('Failed to calculate total marks');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTotalMarks();
    }, [userId]);

    if (loading) {
        return <span>Loading...</span>;
    }

    if (error) {
        return <span className="text-red-500">Error: Failed to fetch total marks</span>;
    }

    return totalMarks;
};

// For use in the Others.jsx component
export const TotalMarksTable = () => {
    return (
        <div className="mb-6 relative">
            <h2 className="font-bold text-base mb-3">
                10. Total Self-Assessment Marks obtained (Max 200):
            </h2>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2 text-left">Category</th>
                        <th className="border p-2 text-right">Total Marks</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border p-2">Total Self-Assessment Marks</td>
                        <td className="border p-2 text-right">
                            <TotalMarksDisplay />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default TotalMarksDisplay;