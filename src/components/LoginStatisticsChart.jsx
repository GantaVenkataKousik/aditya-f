import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';

const LoginStatisticsChart = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDesignation, setSelectedDesignation] = useState('');
    const [availableDesignations, setAvailableDesignations] = useState([]);
    const [loginData, setLoginData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState('designation'); // 'designation' or 'hourly'
    const [showUserData, setShowUserData] = useState(false);
    const [loggedInUsers, setLoggedInUsers] = useState({});

    // Define designation colors to match the summary boxes
    const designationColors = {
        'HOD': '#e67528',    // Orange
        'Dean': '#3b82f6',   // Blue
        'Faculty': '#10b981', // Green
        'Admin': '#8b5cf6'   // Purple
    };

    useEffect(() => {
        fetchLoginData();
    }, [selectedDate, selectedDesignation, viewMode]);

    useEffect(() => {
        // Add Google Fonts link if it doesn't exist
        if (!document.getElementById('google-poppins-font')) {
            const link = document.createElement('link');
            link.id = 'google-poppins-font';
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
            document.head.appendChild(link);
        }
    }, []);

    const fetchLoginData = async () => {
        setIsLoading(true);
        try {
            // Create a date at noon to avoid timezone issues
            const dateToUse = new Date(selectedDate);
            dateToUse.setHours(12, 0, 0, 0);

            // Format date as YYYY-MM-DD
            const formattedDate = dateToUse.toISOString().split('T')[0];

            // Build query URL with filters
            let url = `https://aditya-b.onrender.com/login/login-statistics?date=${formattedDate}`;
            if (selectedDesignation) {
                url += `&designation=${selectedDesignation}`;
            }
            if (viewMode === 'hourly') {
                url += '&hourly=true';
            }

            console.log("Fetching data from:", url); // Add this for debugging

            const response = await fetch(url);
            const data = await response.json();
            console.log("API Response:", data);

            if (data.success) {
                // Ensure all designations are in the data
                const expectedDesignations = ['HOD', 'Dean', 'Faculty', 'Admin'];

                // For designation view - ensure all designations appear with zero values if needed
                if (data.byDesignation) {
                    const existingDesignations = data.byDesignation.map(item => item.designation);

                    expectedDesignations.forEach(designation => {
                        if (!existingDesignations.includes(designation)) {
                            data.byDesignation.push({
                                designation,
                                count: 0,
                                totalLogins: 0
                            });
                        }
                    });

                    // Sort designations (optional but makes the chart order consistent)
                    data.byDesignation.sort((a, b) => {
                        const order = { 'HOD': 1, 'Dean': 2, 'Faculty': 3, 'Admin': 4 };
                        return order[a.designation] - order[b.designation];
                    });

                    // Recreate the chartData with all designations
                    data.chartData = {
                        labels: data.byDesignation.map(item => item.designation),
                        datasets: {
                            counts: data.byDesignation.map(item => item.count),
                            logins: data.byDesignation.map(item => item.totalLogins)
                        }
                    };
                }

                // For hourly view
                if (viewMode === 'hourly' && !data.hourlyData) {
                    const hours = Array.from({ length: 24 }, (_, i) => i);

                    const allZeroData = hours.map(() => 0);

                    // Create a proper empty hourly dataset
                    const emptyHourlyData = {
                        labels: hours.map(h => `${h}:00`),
                        datasets: {}
                    };

                    expectedDesignations.forEach(designation => {
                        emptyHourlyData.datasets[designation] = [...allZeroData];
                    });

                    data.hourlyData = emptyHourlyData;
                }

                if (data.usersData) {
                    // Group users by designation
                    const groupedUsers = data.usersData.reduce((acc, user) => {
                        const designation = user.designation || 'Unknown';
                        if (!acc[designation]) {
                            acc[designation] = [];
                        }
                        acc[designation].push(user);
                        return acc;
                    }, {});

                    setLoggedInUsers(groupedUsers);
                }

                setLoginData(data);

                // Set available designations
                setAvailableDesignations(expectedDesignations);
            } else {
                console.error("Failed to fetch login data:", data.message);
            }
        } catch (error) {
            console.error("Error fetching login data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetFilters = () => {
        setSelectedDate(new Date());
        setSelectedDesignation('');
    };

    // Format hours to AM/PM format
    const formatHour = (hour) => {
        const h = hour % 12 || 12;
        const ampm = hour < 12 || hour === 24 ? 'AM' : 'PM';
        return `${h} ${ampm}`;
    };

    // Chart options and series based on view mode
    const getChartConfig = () => {
        if (viewMode === 'hourly') {
            // Hourly chart configuration
            const hourlyLabels = Array.from({ length: 24 }, (_, i) => formatHour(i));

            // Ensure all designation types are represented in the series
            const expectedDesignations = ['HOD', 'Dean', 'Faculty', 'Admin'];

            let seriesData = [];
            if (loginData && loginData.hourlyData && parseInt(loginData.totalLogins) > 0) {
                // Include all designations regardless of whether they have data
                seriesData = expectedDesignations.map(designation => {
                    return {
                        name: designation,
                        data: loginData.hourlyData.datasets[designation] || new Array(24).fill(0),
                        color: designationColors[designation]
                    };
                });
            }

            return {
                options: {
                    chart: {
                        type: 'line',
                        height: 350,
                        fontFamily: 'Poppins, sans-serif',
                        toolbar: {
                            show: true,
                            tools: {
                                download: true,
                                selection: true,
                                zoom: true,
                                zoomin: true,
                                zoomout: true,
                                pan: true,
                                reset: true
                            },
                            autoSelected: 'zoom'
                        }
                    },
                    stroke: {
                        width: 3,
                        curve: 'smooth'
                    },
                    xaxis: {
                        categories: hourlyLabels,
                        title: {
                            text: 'Hour of Day'
                        }
                    },
                    yaxis: {
                        title: {
                            text: 'Login Count'
                        },
                        labels: {
                            formatter: function (val) {
                                return Math.floor(val);
                            }
                        },
                        min: 0
                    },
                    tooltip: {
                        enabled: true,
                        y: {
                            formatter: function (val) {
                                return Math.floor(val) + " logins";
                            }
                        },
                        theme: 'light',
                        shared: true,
                        intersect: false,
                        custom: undefined,
                        followCursor: false,
                        fixed: {
                            enabled: false
                        }
                    },
                    legend: {
                        position: 'top',
                        fontFamily: 'Poppins, sans-serif'
                    },
                    markers: {
                        size: 5,
                        hover: {
                            size: 7
                        }
                    },
                    colors: Object.values(designationColors),
                    grid: {
                        borderColor: '#e0e0e0',
                        row: {
                            colors: ['#f5f5f5', 'transparent'],
                            opacity: 0.5
                        }
                    }
                },
                series: seriesData
            };
        }

        // Designation view (default)
        return {
            options: {
                chart: {
                    type: 'bar',
                    height: 350,
                    fontFamily: 'Poppins, sans-serif',
                    toolbar: {
                        show: true,
                        tools: {
                            download: true,
                            selection: true,
                            zoom: true,
                            zoomin: true,
                            zoomout: true,
                            pan: true,
                            reset: true
                        }
                    }
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        borderRadius: 4,
                        dataLabels: {
                            position: 'top'
                        },
                        distributed: true // Important: enables individual color for each bar
                    },
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return val;
                    },
                    offsetY: -20,
                    style: {
                        fontSize: '12px',
                        fontFamily: 'Poppins, sans-serif',
                        colors: ["#304758"]
                    }
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                },
                xaxis: {
                    categories: loginData?.chartData?.labels || [],
                    title: {
                        text: 'Designations',
                        style: {
                            fontFamily: 'Poppins, sans-serif'
                        }
                    }
                },
                yaxis: {
                    title: {
                        text: 'Logins',
                        style: {
                            fontFamily: 'Poppins, sans-serif'
                        }
                    },
                    labels: {
                        formatter: function (val) {
                            return Math.floor(val);
                        },
                        style: {
                            fontFamily: 'Poppins, sans-serif'
                        }
                    },
                    min: 0
                },
                fill: {
                    opacity: 1
                },
                tooltip: {
                    enabled: true,
                    y: {
                        formatter: function (val) {
                            return Math.floor(val) + " logins";
                        }
                    },
                    theme: 'light',
                    custom: undefined,
                    fixed: {
                        enabled: false
                    }
                },
                colors: loginData?.chartData?.labels.map(label => designationColors[label]) || [],
                legend: {
                    show: false // Hide legend for distributed bars
                }
            },
            series: [{
                name: 'Login Count',
                data: loginData?.chartData?.datasets.counts || []
            }]
        };
    };

    const chartConfig = getChartConfig();

    const toggleUserData = () => {
        setShowUserData(!showUserData);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <h2 className="text-xl font-bold mb-4">Login Statistics</h2>

            {/* Center the filter controls */}
            <div className="flex flex-wrap justify-center items-end gap-4 mb-6">
                {/* Date Filter */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Date</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={date => setSelectedDate(date)}
                        maxDate={new Date()}
                        className="border rounded p-2 w-full"
                        dateFormat="yyyy-MM-dd"
                    />
                </div>

                {/* Designation Filter */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Designation</label>
                    <select
                        value={selectedDesignation}
                        onChange={e => setSelectedDesignation(e.target.value)}
                        className="border rounded p-2 w-full"
                    >
                        <option value="">All Designations</option>
                        {availableDesignations.map((designation, index) => (
                            <option key={index} value={designation}>
                                {designation}
                            </option>
                        ))}
                    </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">View Mode</label>
                    <select
                        value={viewMode}
                        onChange={e => setViewMode(e.target.value)}
                        className="border rounded p-2 w-full"
                    >
                        <option value="designation">By Designation</option>
                        <option value="hourly">Hourly Breakdown</option>
                    </select>
                </div>

                {/* Reset Button */}
                <div>
                    <button
                        onClick={resetFilters}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
                    >
                        Reset Filters
                    </button>
                </div>

                <button
                    onClick={toggleUserData}
                    className="bg-[#e67528] hover:bg-[#d56a24] text-white px-4 py-2 rounded"
                >
                    {showUserData ? 'Hide' : 'Show'} Logged-in Users
                </button>
            </div>

            {/* Summary Statistics */}
            {loginData && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-orange-50 p-4 rounded-lg shadow border-l-4 border-orange-300">
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="text-lg font-semibold">{loginData.date}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg shadow border-l-4 border-blue-300">
                        <p className="text-sm text-gray-600">Total Logins</p>
                        <p className="text-lg font-semibold">{loginData.totalLogins}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg shadow border-l-4 border-green-300">
                        <p className="text-sm text-gray-600">Login Events</p>
                        <p className="text-lg font-semibold">{loginData.totalCount}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg shadow border-l-4 border-purple-300">
                        <p className="text-sm text-gray-600">Designations</p>
                        <p className="text-lg font-semibold">{loginData.byDesignation?.length || 0}</p>
                    </div>
                </div>
            )}

            {/* Chart */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
            ) : loginData ? (
                parseInt(loginData.totalLogins) === 0 ? (
                    // Be very explicit about no data
                    <div className="text-center p-8 text-gray-500">
                        <p className="text-lg mb-2">No login data available for {loginData.date}</p>
                        <p>There were no user logins recorded on this date.</p>
                    </div>
                ) : (
                    <div className="mt-4">
                        <ReactApexChart
                            options={chartConfig.options}
                            series={chartConfig.series}
                            type={viewMode === 'hourly' ? 'line' : 'bar'}
                            height={350}
                        />

                        {/* Add color legend when using distributed bars */}
                        {viewMode === 'designation' && (
                            <div className="flex justify-center items-center mt-4 flex-wrap gap-4">
                                {Object.entries(designationColors).map(([designation, color]) => (
                                    <div key={designation} className="flex items-center">
                                        <div className="w-4 h-4 mr-2" style={{ backgroundColor: color }}></div>
                                        <span>{designation}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="text-center text-sm text-gray-500 mt-2">
                            <p>Note: Login Count shows the number of successful login sessions.</p>
                        </div>
                    </div>
                )
            ) : (
                <div className="text-center p-8 text-gray-500">
                    No login data available for the selected filters
                </div>
            )}

            {/* User Data Section */}
            {showUserData && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Logged-in Users for {selectedDate.toISOString().split('T')[0]}</h3>
                    <div className="space-y-6">
                        {Object.keys(loggedInUsers).length > 0 ? (
                            Object.keys(loggedInUsers).map((designation) => (
                                <div
                                    key={designation}
                                    className="shadow-lg p-4 rounded-lg"
                                    style={{
                                        backgroundColor: designation === 'HOD' ? '#fff8f3' :
                                            designation === 'Dean' ? '#f0f7ff' :
                                                designation === 'Faculty' ? '#f0fdf6' :
                                                    designation === 'Admin' ? '#f5f3ff' :
                                                        '#f9fafb',
                                        borderLeft: `4px solid ${designationColors[designation] || '#d1d5db'}`
                                    }}
                                >
                                    <h3 className="text-lg font-semibold pb-2"
                                        style={{ color: designationColors[designation] || '#374151' }}>
                                        {designation}
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                        {loggedInUsers[designation].map((user) => (
                                            <div key={user._id}
                                                className="bg-white p-4 rounded-lg shadow-md relative overflow-hidden"
                                                style={{
                                                    borderLeft: `4px solid ${designationColors[designation] || '#d1d5db'}`,
                                                }}
                                            >
                                                {/* Login count as a badge in the top right */}
                                                <div className="absolute top-3 right-3 flex flex-col items-center">
                                                    <span className="text-3xl font-bold" style={{ color: designationColors[designation] }}>
                                                        {user.loginCount || 0}
                                                    </span>
                                                    <span className="text-xs text-gray-500">Logins</span>
                                                </div>

                                                {/* User information */}
                                                <p className="text-lg font-semibold pr-16">{user.fullName}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                                <p className="text-sm text-gray-500">Emp ID: {user.EmpID}</p>
                                                <p className="text-sm text-gray-500">Joining: {user.JoiningDate}</p>
                                                <p className="text-sm text-gray-500">Qualification: {user.Qualification}</p>

                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                No users logged in on this date.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginStatisticsChart;