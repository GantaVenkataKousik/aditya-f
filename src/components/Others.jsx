import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TotalMarksDisplay from './TotalMarksDisplay';

const Others = ({ data: propsData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!propsData);
  const [outreachMarks, setOutreachMarks] = useState(0);
  const [specialMarks, setSpecialMarks] = useState(0);
  const [additionalMarks, setAdditionalMarks] = useState(0);
  const [activities, setActivities] = useState(propsData?.Activities || []);
  const [responsibilities, setResponsibilities] = useState(propsData?.Responsibilities || []);
  const [contribution, setContribution] = useState(propsData?.Contribution || []);
  const [awards, setAwards] = useState(propsData?.Awards || []);
  const [activityMarks, setActivityMarks] = useState(propsData?.ActivityMarks || 0);
  const [responsibilityMarks, setResponsibilityMarks] = useState(propsData?.ResponsibilityMarks || 0);
  const [contributionMarks, setContributionMarks] = useState(propsData?.ContributionMarks || 0);

  // Edit form visibility states
  const [showActivityUpdate, setShowActivityUpdate] = useState(false);
  const [showResponsibilityUpdate, setShowResponsibilityUpdate] = useState(false);
  const [showContributionUpdate, setShowContributionUpdate] = useState(false);
  const [showAwardUpdate, setShowAwardUpdate] = useState(false);

  // Current item being edited
  const [currentIndex, setCurrentIndex] = useState(null);
  const [currentItemId, setCurrentItemId] = useState(null);

  // Form field states
  const [activityDetails, setActivityDetails] = useState('');
  const [responsibilityDetails, setResponsibilityDetails] = useState('');
  const [responsibilityAssignedBy, setResponsibilityAssignedBy] = useState('');
  const [contributionDetails, setContributionDetails] = useState('');
  const [contributionBenefit, setContributionBenefit] = useState('');
  const [AwardName, setAwardName] = useState('');
  const [AwardedBy, setAwardedBy] = useState('');
  const [level, setLevel] = useState('');
  const [description, setDescription] = useState('');

  // IMPORTANT: Get userId from localStorage as the document ID
  const getUserId = () => {
    return localStorage.getItem('userId');
  };

  // Fetch all data if not provided in props
  const fetchAll = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://aditya-b.onrender.com/others-data?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      let res = await response.json();
      if (res.success) {
        const data = res.others;
        setActivities(data.Activities || []);
        setResponsibilities(data.Responsibilities || []);
        setContribution(data.Contribution || []);
        setAwards(data.Awards || []);

        // Calculate marks based on fetched data
        const outreachMarks = data.Activities?.length > 0 ? 10 : 0;
        const specialMarks = data.Contribution?.length > 0 ? 10 : 0;
        const additionalMarks = data.Responsibilities?.length > 0 ? 20 : 0;

        // Update localStorage and state
        localStorage.setItem('outreachmarks', outreachMarks);
        localStorage.setItem('specialmarks', specialMarks);
        localStorage.setItem('additionalmarks', additionalMarks);

        setOutreachMarks(outreachMarks);
        setSpecialMarks(specialMarks);
        setAdditionalMarks(additionalMarks);
      } else {
        console.error('Error fetching data:', await response.text());
        toast.error('Failed to load data');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Network error while fetching data');
    } finally {
      setLoading(false);
    }
  };

  // Add these utility functions at the top of your component
  const validateMarks = (marks) => {
    const numMarks = Number(marks);
    return Math.min(10, Math.max(0, numMarks));
  };
  const validateMarks20 = (marks) => {
    const numMarks = Number(marks);
    return Math.min(20, Math.max(0, numMarks));
  };

  useEffect(() => {
    if (!propsData) {
      fetchAll();
    }
    // Calculate marks based on records
    const outreachMarks = activities.length > 0 ? 10 : 0;
    const specialMarks = contribution.length > 0 ? 10 : 0;
    const additionalMarks = responsibilities.length > 0 ? 20 : 0;

    // Update localStorage with calculated marks
    localStorage.setItem('outreachmarks', outreachMarks);
    localStorage.setItem('specialmarks', specialMarks);
    localStorage.setItem('additionalmarks', additionalMarks);

    // Set state with calculated marks
    setOutreachMarks(outreachMarks);
    setSpecialMarks(specialMarks);
    setAdditionalMarks(additionalMarks);
  }, []);

  // ======== ACTIVITIES HANDLERS ========
  const handleActivityUpdateClick = (activity, index) => {
    setActivityDetails(activity.activityDetails || '');
    setCurrentIndex(index);
    setCurrentItemId(activity._id || null);
    setShowActivityUpdate(true);
  };

  const handleActivityUpdate = async (e) => {
    e.preventDefault();
    try {
      const userId = getUserId();
      console.log("User ID for activity update:", userId);
      console.log("Current activity index:", currentIndex);

      if (!userId) {
        toast.error('User ID not found. Please log in again.');
        return;
      }

      const token = localStorage.getItem('token');

      // FIXED: Now using userId instead of document ID
      const response = await fetch(`https://aditya-b.onrender.com/activities/${userId}/${currentIndex}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activityDetails })
      });

      const data = await response.json();
      console.log("Activity update response:", data);

      if (response.ok && data.success) {
        toast.success('Activity updated successfully');
        setShowActivityUpdate(false);

        setActivities(prevActivities => {
          const updatedActivities = [...prevActivities];
          updatedActivities[currentIndex] = {
            ...updatedActivities[currentIndex],
            activityDetails
          };
          return updatedActivities;
        });
        fetchAll();
      } else {
        toast.error(data.message || 'Failed to update activity');
        console.error('Update failed:', data);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error updating activity');
    }
  };

  const handleActivityDelete = async (index) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      const userId = getUserId();
      console.log("User ID for activity delete:", userId);
      console.log("Deleting activity at index:", index);

      if (!userId) {
        toast.error('User ID not found. Please log in again.');
        return;
      }

      const token = localStorage.getItem('token');

      // FIXED: Now using userId instead of document ID
      const response = await fetch(`https://aditya-b.onrender.com/activities/${userId}/${index}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      console.log("Activity delete response:", data);

      if (response.ok && data.success) {
        toast.success('Activity deleted successfully');

        // Update local state
        setActivities(prevActivities =>
          prevActivities.filter((_, i) => i !== index)
        );
        fetchAll();
      } else {
        toast.error(data.message || 'Failed to delete activity');
        console.error('Delete failed:', data);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error deleting activity');
    }
  };

  // ======== RESPONSIBILITIES HANDLERS ========
  const handleResponsibilityUpdateClick = (responsibility, index) => {
    setResponsibilityDetails(responsibility.Responsibility || '');
    setResponsibilityAssignedBy(responsibility.assignedBy || '');
    setCurrentIndex(index);
    setCurrentItemId(responsibility._id || null);
    setShowResponsibilityUpdate(true);
  };

  const handleResponsibilityUpdate = async (e) => {
    e.preventDefault();
    try {
      const userId = getUserId();
      console.log("User ID for responsibility update:", userId);
      console.log("Current responsibility index:", currentIndex);

      if (!userId) {
        toast.error('User ID not found. Please log in again.');
        return;
      }

      const token = localStorage.getItem('token');

      // FIXED: Now using userId instead of document ID
      const response = await fetch(`https://aditya-b.onrender.com/responsibilities/${userId}/${currentIndex}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Responsibility: responsibilityDetails,
          assignedBy: responsibilityAssignedBy
        })
      });

      const data = await response.json();
      console.log("Responsibility update response:", data);

      if (response.ok && data.success) {
        toast.success('Responsibility updated successfully');
        setShowResponsibilityUpdate(false);

        // Update local state
        setResponsibilities(prevItems => {
          const updatedItems = [...prevItems];
          updatedItems[currentIndex] = {
            ...updatedItems[currentIndex],
            Responsibility: responsibilityDetails,
            assignedBy: responsibilityAssignedBy
          };
          return updatedItems;
        });
        fetchAll();
      } else {
        toast.error(data.message || 'Failed to update responsibility');
        console.error('Update failed:', data);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error updating responsibility');
    }
  };

  const handleResponsibilityDelete = async (index) => {
    if (!window.confirm('Are you sure you want to delete this responsibility?')) {
      return;
    }

    try {
      const userId = getUserId();
      console.log("User ID for responsibility delete:", userId);
      console.log("Deleting responsibility at index:", index);

      if (!userId) {
        toast.error('User ID not found. Please log in again.');
        return;
      }

      const token = localStorage.getItem('token');

      // FIXED: Now using userId instead of document ID
      const response = await fetch(`https://aditya-b.onrender.com/responsibilities/${userId}/${index}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      console.log("Responsibility delete response:", data);

      if (response.ok && data.success) {
        toast.success('Responsibility deleted successfully');

        // Update local state
        setResponsibilities(prevItems =>
          prevItems.filter((_, i) => i !== index)
        );
        fetchAll();
      } else {
        toast.error(data.message || 'Failed to delete responsibility');
        console.error('Delete failed:', data);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error deleting responsibility');
    }
  };

  // ======== CONTRIBUTION HANDLERS ========
  const handleContributionUpdateClick = (contrib, index) => {
    setContributionDetails(contrib.contributionDetails || '');
    setContributionBenefit(contrib.Benefit || '');
    setCurrentIndex(index);
    setCurrentItemId(contrib._id || null);
    setShowContributionUpdate(true);
  };

  const handleContributionUpdate = async (e) => {
    e.preventDefault();
    try {
      const userId = getUserId();
      console.log("User ID for contribution update:", userId);
      console.log("Current contribution index:", currentIndex);

      if (!userId) {
        toast.error('User ID not found. Please log in again.');
        return;
      }

      const token = localStorage.getItem('token');

      // FIXED: Now using userId instead of document ID
      const response = await fetch(`https://aditya-b.onrender.com/contribution/${userId}/${currentIndex}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contributionDetails,
          Benefit: contributionBenefit
        })
      });

      const data = await response.json();
      console.log("Contribution update response:", data);

      if (response.ok && data.success) {
        toast.success('Contribution updated successfully');
        setShowContributionUpdate(false);

        // Update local state
        setContribution(prevItems => {
          const updatedItems = [...prevItems];
          updatedItems[currentIndex] = {
            ...updatedItems[currentIndex],
            contributionDetails,
            Benefit: contributionBenefit
          };
          return updatedItems;
        });
        fetchAll();
      } else {
        toast.error(data.message || 'Failed to update contribution');
        console.error('Update failed:', data);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error updating contribution');
    }
  };

  const handleContributionDelete = async (index) => {
    if (!window.confirm('Are you sure you want to delete this contribution?')) {
      return;
    }

    try {
      const userId = getUserId();
      console.log("User ID for contribution delete:", userId);
      console.log("Deleting contribution at index:", index);

      if (!userId) {
        toast.error('User ID not found. Please log in again.');
        return;
      }

      const token = localStorage.getItem('token');

      // FIXED: Now using userId instead of document ID
      const response = await fetch(`https://aditya-b.onrender.com/contribution/${userId}/${index}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      console.log("Contribution delete response:", data);

      if (response.ok && data.success) {
        toast.success('Contribution deleted successfully');

        // Update local state
        setContribution(prevItems =>
          prevItems.filter((_, i) => i !== index)
        );
        fetchAll();
      } else {
        toast.error(data.message || 'Failed to delete contribution');
        console.error('Delete failed:', data);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error deleting contribution');
    }
  };

  // ======== AWARDS HANDLERS ========
  const handleAwardUpdateClick = (award, index) => {
    setAwardName(award.Award || '');
    setAwardedBy(award.AwardedBy || '');
    setLevel(award.Level || '');
    setDescription(award.Description || '');
    setCurrentIndex(index);
    setCurrentItemId(award._id || null);
    setShowAwardUpdate(true);
  };

  const handleAwardUpdate = async (e) => {
    e.preventDefault();
    try {
      const userId = getUserId();
      const token = localStorage.getItem('token');

      const response = await fetch(`https://aditya-b.onrender.com/awards/${userId}/${currentIndex}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Award: AwardName,
          Aware: AwardedBy,
          Level: level,
          Description: description
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        toast.success('Award updated successfully');
        setShowAwardUpdate(false);

        // Update local state
        setAwards(prevItems => {
          const updatedItems = [...prevItems];
          updatedItems[currentIndex] = {
            ...updatedItems[currentIndex],
            Award: AwardName,
            AwardedBy: AwardedBy,
            Level: level,
            Description: description
          };
          return updatedItems;
        });
        fetchAll();
      } else {
        toast.error(data.message || 'Failed to update award');
        console.error('Update failed:', data);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error updating award');
    }
  };

  const handleAwardDelete = async (index) => {
    if (!window.confirm('Are you sure you want to delete this award?')) {
      return;
    }

    try {
      const userId = getUserId();
      console.log("User ID for award delete:", userId);
      console.log("Deleting award at index:", index);

      if (!userId) {
        toast.error('User ID not found. Please log in again.');
        return;
      }

      const token = localStorage.getItem('token');

      // FIXED: Now using userId instead of document ID
      const response = await fetch(`https://aditya-b.onrender.com/awards/${userId}/${index}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      console.log("Award delete response:", data);

      if (response.ok && data.success) {
        toast.success('Award deleted successfully');

        // Update local state
        setAwards(prevItems =>
          prevItems.filter((_, i) => i !== index)
        );
      } else {
        toast.error(data.message || 'Failed to delete award');
        console.error('Delete failed:', data);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error deleting award');
    }
  };

  const handleUpload = async () => {
    toast.success('Image uploaded successfully');
  };

  // Remove or modify the handleMarksUpdate function since marks are now automatic
  const handleMarksUpdate = async (type, value) => {
    // This function is no longer needed as marks are calculated automatically
    // You can remove it or keep it for API synchronization
    try {
      const userId = getUserId();
      const calculatedValue = type === 'additional' ?
        (responsibilities.length > 0 ? 20 : 0) :
        (type === 'outreach' ?
          (activities.length > 0 ? 10 : 0) :
          (contribution.length > 0 ? 10 : 0));

      const response = await fetch(`https://aditya-b.onrender.com/update-marks/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          markType: type,
          value: calculatedValue
        })
      });

      if (response.ok) {
        localStorage.setItem(`${type}marks`, calculatedValue);
        switch (type) {
          case 'outreach':
            setOutreachMarks(calculatedValue);
            break;
          case 'special':
            setSpecialMarks(calculatedValue);
            break;
          case 'additional':
            setAdditionalMarks(calculatedValue);
            break;
        }
        fetchAll();
      }
    } catch (error) {
      console.error('Error updating marks:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      {/** Activities Table **/}
      <div className="mb-6 relative">
        <h2 className="font-bold text-base">
          6. Outreach Activities - (Resource Person/Session Chairs/Invited Talks/Guest Lecture / National / International Collaboration etc.) (1 activity outside AUS – 5 marks)
        </h2>
        <div className="flex justify-end items-center mb-2 gap-2">
          <input
            type="file"
            style={{
              border: '1px solid #ccc',
              padding: '5px',
              borderRadius: '8px'
            }}
            onChange={handleUpload}
          />
          <button
            className="no-print"
            onClick={() => navigate('/addactivity')}
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
            <FaPlus /> Add Activity
          </button>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-center" style={{ width: '80px' }}>
                S.NO
              </th>
              <th className="border p-2 text-center">Activity Details</th>
              {(
                <th className="border p-2 text-center no-print">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {activities.length > 0 ? (
              activities.map((act, index) => (
                <tr key={index} className="border">
                  <td className="p-2 border text-center">{index + 1}</td>
                  <td className="p-2 border text-center">{act.activityDetails}</td>
                  {(
                    <td className="p-2 border text-center no-print">
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        <button
                          className="no-print"
                          onClick={(e) => { e.stopPropagation(); handleActivityUpdateClick(act, index); }}
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
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e67528"}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1a4b88"}
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          className="no-print"
                          onClick={(e) => { e.stopPropagation(); handleActivityDelete(index); }}
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
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#c0392b"}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#e74c3c"}
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-2 border text-center" colSpan="3">
                  No data found..
                </td>
              </tr>
            )}
            <tr>
              <td className="p-2 border text-center font-bold" colSpan="2">
                Self-Assessment Marks (Max: 10)
              </td>
              <td className="p-2 border text-center">
                <span className="font-bold">{activities.length > 0 ? 10 : 0}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/** Responsibilities Table **/}
      <div className="mb-6 relative">
        <h2 className="font-bold text-base">
          7. Additional responsibilities in the Department / College: (College activity/Committee Convenor: 10, Committee member/Dept. Incharge – 5 marks)
        </h2>
        <div className="flex justify-end items-center mb-2 gap-2">
          <input
            type="file"
            style={{
              border: '1px solid #ccc',
              padding: '5px',
              borderRadius: '8px'
            }}
          />
          <button
            className="no-print"
            onClick={() => navigate('/addresponsibility')}
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
            <FaPlus /> Add Responsibility
          </button>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-center" style={{ width: '80px' }}>
                S.NO
              </th>
              <th className="border p-2 text-center">Responsibility</th>
              <th className="border p-2 text-center">Assigned By</th>
              {(
                <th className="border p-2 text-center no-print">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {responsibilities.length > 0 ? (
              responsibilities.map((res, index) => (
                <tr key={index} className="border">
                  <td className="p-2 border text-center">{index + 1}</td>
                  <td className="p-2 border text-center">{res.Responsibility}</td>
                  <td className="p-2 border text-center">{res.AssignedBy}</td>
                  {(
                    <td className="p-2 border text-center no-print">
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        <button
                          className="no-print"
                          onClick={(e) => { e.stopPropagation(); handleResponsibilityUpdateClick(res, index); }}
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
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e67528"}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1a4b88"}
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          className="no-print"
                          onClick={(e) => { e.stopPropagation(); handleResponsibilityDelete(index); }}
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
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#c0392b"}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#e74c3c"}
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-2 border text-center" colSpan="4">
                  No data found..
                </td>
              </tr>
            )}
            <tr>
              <td className="p-2 border text-center font-bold" colSpan="3">
                Self-Assessment Marks (Max: 20)
              </td>
              <td className="p-2 border text-center">
                <span className="font-bold">{responsibilities.length > 0 ? 20 : 0}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/** Contributions Table **/}
      <div className="mb-6 relative">
        <h2 className="font-bold text-base">
          8. Any special contribution to the Department/College which leverage the existing process/System. (Innovation in Teaching / Technology Development / Taking GATE classes / e-content preparation / guiding students for Hackathons / Consultancy / Preparing students for Project challenges / Community Service etc. – Each activity 5 marks)
        </h2>
        <div className="flex justify-end items-center mb-2 gap-2">
          <input
            type="file"
            style={{
              border: '1px solid #ccc',
              padding: '5px',
              borderRadius: '8px'
            }}
          />
          <button
            className="no-print"
            onClick={() => navigate('/addcontribution')}
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
            <FaPlus /> Add Contribution
          </button>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-center" style={{ width: '80px' }}>
                S.NO
              </th>
              <th className="border p-2 text-center">Contribution Details</th>
              <th className="border p-2 text-center">Benefit to College/Department</th>
              {(
                <th className="border p-2 text-center no-print">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {contribution.length > 0 ? (
              contribution.map((cont, index) => (
                <tr key={index} className="border ">
                  <td className="p-2 border text-center">{index + 1}</td>
                  <td className="p-2 border text-center">{cont.contributionDetails}</td>
                  <td className="p-2 border text-center">{cont.Benefit}</td>
                  {(
                    <td style={{ display: 'flex', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        <button
                          className="no-print"
                          onClick={(e) => { e.stopPropagation(); handleResponsibilityUpdateClick(res, index); }}
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
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e67528"}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1a4b88"}
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          className="no-print"
                          onClick={(e) => { e.stopPropagation(); handleResponsibilityDelete(index); }}
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
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#c0392b"}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#e74c3c"}
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-2 border text-center" colSpan="3">
                  No data found..
                </td>
              </tr>
            )}
            <tr>
              <td className="p-2 border text-center font-bold" colSpan="2">
                Self-Assessment Marks (Max: 10)
              </td>
              <td className="p-2 border text-center">

                <input
                  type="number"
                  min="0"
                  max="10"
                  value={specialMarks}
                  onChange={(e) => handleMarksUpdate('special', e.target.value)}
                  className="w-16 text-center"
                  readOnly
                />

              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/** Awards Table **/}
      <div className="mb-6 relative">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-base">9. Awards received by Faculty:</h2>
          <div className="flex items-center gap-2">
            <input
              type="file"
              style={{
                border: '1px solid #ccc',
                padding: '5px',
                borderRadius: '8px'
              }}
            />
            <button
              className="no-print"
              onClick={() => navigate('/addaward')}
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
              <FaPlus /> Add Award
            </button>
          </div>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-center" style={{ width: '80px' }}>
                S.NO
              </th>
              <th className="border p-2 text-center">Award Name</th>
              <th className="border p-2 text-center">Awarded By</th>
              <th className="border p-2 text-center">Level</th>
              <th className="border p-2 text-center">Description</th>
              {(
                <th className="border p-2 text-center no-print">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {awards.length > 0 ? (
              awards.map((award, index) => (
                <tr key={index} className="border">
                  <td className="p-2 border text-center">{index + 1}</td>
                  <td className="p-2 border text-center">{award.Award}</td>
                  <td className="p-2 border text-center">{award.AwardedBy}</td>
                  <td className="p-2 border text-center">{award.Level}</td>
                  <td className="p-2 border text-center">{award.Description}</td>
                  {(
                    <td style={{ display: 'flex', justifyContent: 'center' }} className='no-print'>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        <button
                          className="no-print"
                          onClick={(e) => { e.stopPropagation(); handleResponsibilityUpdateClick(res, index); }}
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
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e67528"}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1a4b88"}
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          className="no-print"
                          onClick={(e) => { e.stopPropagation(); handleResponsibilityDelete(index); }}
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
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#c0392b"}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#e74c3c"}
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-2 border text-center" colSpan="5">
                  No data found..
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Updated Modal forms for editing */}
      {showActivityUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 className="text-xl font-bold mb-0">Update Activity</h2>
              <button
                onClick={() => setShowActivityUpdate(false)}
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
            <form onSubmit={handleActivityUpdate}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Activity Details</label>
                <textarea
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                  value={activityDetails}
                  onChange={(e) => setActivityDetails(e.target.value)}
                  required
                  rows="4"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '15px' }}>
                <button
                  type="button"
                  onClick={() => setShowActivityUpdate(false)}
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
                  type="submit"
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
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showResponsibilityUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 className="text-xl font-bold mb-0">Update Responsibility</h2>
              <button
                onClick={() => setShowResponsibilityUpdate(false)}
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
            <form onSubmit={handleResponsibilityUpdate}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Responsibility</label>
                  <textarea
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxSizing: 'border-box'
                    }}
                    value={responsibilityDetails}
                    onChange={(e) => setResponsibilityDetails(e.target.value)}
                    required
                    rows="4"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Assigned By</label>
                  <input
                    type="text"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxSizing: 'border-box'
                    }}
                    value={responsibilityAssignedBy}
                    onChange={(e) => setResponsibilityAssignedBy(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '15px' }}>
                <button
                  type="button"
                  onClick={() => setShowResponsibilityUpdate(false)}
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
                  type="submit"
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
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showContributionUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Contribution</h2>
            <form onSubmit={handleContributionUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Contribution Details</label>
                <textarea
                  className="w-full p-2 border rounded"
                  value={contributionDetails}
                  onChange={(e) => setContributionDetails(e.target.value)}
                  required
                  rows="4"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Benefit to College/Department</label>
                <input
                  type="text"
                  value={contributionBenefit}
                  onChange={(e) => setContributionBenefit(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setShowContributionUpdate(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAwardUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Award</h2>
            <form onSubmit={handleAwardUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Award Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={AwardName}
                  onChange={(e) => setAwardName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Issuing Organization</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={AwardedBy}
                  onChange={(e) => setAwardedBy(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setShowAwardUpdate(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Total Self-Assessment Marks Table */}
      <div className="mb-6 relative">
        <h2 className="font-bold text-base mb-3">
          10. Total Self-Assessment Marks obtained (Max 200):
        </h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-center" style={{ width: '70%' }}>
                Category
              </th>
              <th className="border p-2 text-center" style={{ width: '30%' }}>
                Total Marks
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border text-center font-bold">
                Total Self-Assessment Marks ( Max 200 )
              </td>
              <td className="p-2 border text-center font-bold">
                <TotalMarksDisplay userId={getUserId()} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Others;
