import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Others = ({ data: propsData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!propsData);

  // Data states
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
  const [awardName, setAwardName] = useState('');
  const [awardedBy, setAwardedBy] = useState('');

  // IMPORTANT: Get userId from localStorage as the document ID
  const getUserId = () => {
    return localStorage.getItem('userId');
  };

  // Fetch all data if not provided in props
  const fetchAll = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/others/data', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched data:", data);

        // Set data to state
        setActivities(data.Activities || []);
        setResponsibilities(data.Responsibilities || []);
        setContribution(data.Contribution || []);
        setAwards(data.Awards || []);
        setActivityMarks(data.ActivityMarks || 0);
        setResponsibilityMarks(data.ResponsibilityMarks || 0);
        setContributionMarks(data.ContributionMarks || 0);
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

  useEffect(() => {
    if (!propsData) {
      fetchAll();
    }
  }, [propsData]);

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
      const response = await fetch(`http://localhost:5000/activities/${userId}/${currentIndex}`, {
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

        // Update local state
        setActivities(prevActivities => {
          const updatedActivities = [...prevActivities];
          updatedActivities[currentIndex] = {
            ...updatedActivities[currentIndex],
            activityDetails
          };
          return updatedActivities;
        });
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
      const response = await fetch(`http://localhost:5000/activities/${userId}/${index}`, {
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
      const response = await fetch(`http://localhost:5000/responsibilities/${userId}/${currentIndex}`, {
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
      const response = await fetch(`http://localhost:5000/responsibilities/${userId}/${index}`, {
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
      const response = await fetch(`http://localhost:5000/contribution/${userId}/${currentIndex}`, {
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
      const response = await fetch(`http://localhost:5000/contribution/${userId}/${index}`, {
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
    setAwardedBy(award.IssuingOrg || '');
    setCurrentIndex(index);
    setCurrentItemId(award._id || null);
    setShowAwardUpdate(true);
  };

  const handleAwardUpdate = async (e) => {
    e.preventDefault();
    try {
      const userId = getUserId();
      console.log("User ID for award update:", userId);
      console.log("Current award index:", currentIndex);

      if (!userId) {
        toast.error('User ID not found. Please log in again.');
        return;
      }

      const token = localStorage.getItem('token');

      // FIXED: Now using userId instead of document ID
      const response = await fetch(`http://localhost:5000/awards/${userId}/${currentIndex}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Award: awardName,
          IssuingOrg: awardedBy
        })
      });

      const data = await response.json();
      console.log("Award update response:", data);

      if (response.ok && data.success) {
        toast.success('Award updated successfully');
        setShowAwardUpdate(false);

        // Update local state
        setAwards(prevItems => {
          const updatedItems = [...prevItems];
          updatedItems[currentIndex] = {
            ...updatedItems[currentIndex],
            Award: awardName,
            IssuingOrg: awardedBy
          };
          return updatedItems;
        });
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
      const response = await fetch(`http://localhost:5000/awards/${userId}/${index}`, {
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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      {/** Activities Table **/}
      <div className="mb-6 relative">
        <h2 className="font-bold text-base">
          6. Outreach Activities - (Resource Person/Session Chairs/Invited Talks/Guest Lecture / National / International Collaboration etc.) (1 activity outside AUS – 5 marks)
        </h2>
        <div className="flex justify-end items-center mb-2 gap-2">
          <input type="file" style={{ border: '1px solid #ccc', padding: '5px', borderRadius: '8px' }} />
          <button className="p-1 bg-blue-500 text-white rounded text-sm w-24 h-8 no-print" onClick={handleUpload}>Upload</button>
          <button className="p-1 bg-blue-500 text-white rounded text-sm w-24 h-8 no-print" onClick={() => navigate('/addactivity')}>
            + Add
          </button>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-center" style={{ width: '80px' }}>
                S.NO
              </th>
              <th className="border p-2 text-center">Activity Details</th>
              <th className="border p-2 text-center no-print">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.length > 0 ? (
              activities.map((act, index) => (
                <tr key={index} className="border">
                  <td className="p-2 border text-center">{index + 1}</td>
                  <td className="p-2 border text-center">{act.activityDetails}</td>
                  <td className="p-2 border text-center no-print" style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      className="no-print"
                      onClick={(e) => { e.stopPropagation(); handleActivityUpdateClick(act, index); }}
                      style={{
                        fontSize: "16px",
                        margin: "2px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        backgroundColor: "rgb(59 130 246)",
                        color: "white",
                        transition: "0.3s",
                        width: "auto",
                        padding: "4px 8px"
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="no-print"
                      onClick={(e) => { e.stopPropagation(); handleActivityDelete(index); }}
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
                    >
                      <FaTrash />
                    </button>
                  </td>
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
              <td className="p-2 border text-center font-bold no-print">{activityMarks}</td>
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
          <input type="file" style={{ border: '1px solid #ccc', padding: '5px', borderRadius: '8px' }} />
          <button className="p-1 bg-blue-500 text-white rounded text-sm w-24 h-8 no-print" onClick={handleUpload}>Upload</button>
          <button className="p-1 bg-blue-500 text-white rounded text-sm w-24 h-8 no-print" onClick={() => navigate('/addresponsibility')}>
            + Add
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
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {responsibilities.length > 0 ? (
              responsibilities.map((res, index) => (
                <tr key={index} className="border">
                  <td className="p-2 border text-center">{index + 1}</td>
                  <td className="p-2 border text-center">{res.Responsibility}</td>
                  <td className="p-2 border text-center">{res.assignedBy}</td>
                  <td style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      className="no-print"
                      onClick={(e) => { e.stopPropagation(); handleResponsibilityUpdateClick(res, index); }}
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
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="no-print"
                      onClick={(e) => { e.stopPropagation(); handleResponsibilityDelete(index); }}
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
                    >
                      <FaTrash />
                    </button>
                  </td>
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
              <td className="p-2 border text-center font-bold">{responsibilityMarks}</td>
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
          <input type="file" style={{ border: '1px solid #ccc', padding: '5px', borderRadius: '8px' }} />
          <button className="p-1 bg-blue-500 text-white rounded text-sm w-24 h-8 no-print" onClick={handleUpload}>Upload</button>
          <button className="p-1 bg-blue-500 text-white rounded text-sm w-24 h-8 no-print" onClick={() => navigate('/addcontribution')}>
            + Add
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
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contribution.length > 0 ? (
              contribution.map((cont, index) => (
                <tr key={index} className="border no-print">
                  <td className="p-2 border text-center">{index + 1}</td>
                  <td className="p-2 border text-center">{cont.contributionDetails}</td>
                  <td className="p-2 border text-center">{cont.Benefit}</td>
                  <td style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleContributionUpdateClick(cont, index); }}
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
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleContributionDelete(index); }}
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
                    >
                      <FaTrash />
                    </button>
                  </td>
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
              <td className="p-2 border text-center font-bold">{contributionMarks}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/** Awards Table **/}
      <div className="mb-6 relative">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-base">9. Awards received by Faculty:</h2>
          <div className="flex items-center gap-2 no-print">
            <input type="file" style={{ border: '1px solid #ccc', padding: '5px', borderRadius: '8px' }} />
            <button className="p-1 bg-blue-500 text-white rounded text-sm w-24 h-8 no-print" onClick={handleUpload}  >Upload</button>
            <button className="p-1 bg-blue-500 text-white rounded text-sm w-24 h-8 no-print" onClick={() => navigate('/addaward')}>
              + Add
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
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {awards.length > 0 ? (
              awards.map((award, index) => (
                <tr key={index} className="border no-print">
                  <td className="p-2 border text-center">{index + 1}</td>
                  <td className="p-2 border text-center">{award.awardName}</td>
                  <td className="p-2 border text-center">{award.awardedBy}</td>
                  <td className="p-2 border text-center">{award.level}</td>
                  <td className="p-2 border text-center">{award.description}</td>
                  <td style={{ display: 'flex', justifyContent: 'center' }} className='no-print'>
                    <button
                      className='no-print'
                      onClick={(e) => { e.stopPropagation(); handleAwardUpdateClick(award, index); }}
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
                    >
                      <FaEdit />
                    </button>
                    <button
                      className='no-print'
                      onClick={(e) => { e.stopPropagation(); handleAwardDelete(index); }}
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
                    >
                      <FaTrash />
                    </button>
                  </td>
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

      {/* Modal forms for editing */}
      {showActivityUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Activity</h2>
            <form onSubmit={handleActivityUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Activity Details</label>
                <textarea
                  className="w-full p-2 border rounded"
                  value={activityDetails}
                  onChange={(e) => setActivityDetails(e.target.value)}
                  required
                  rows="4"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setShowActivityUpdate(false)}
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

      {showResponsibilityUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Responsibility</h2>
            <form onSubmit={handleResponsibilityUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Responsibility</label>
                <textarea
                  className="w-full p-2 border rounded"
                  value={responsibilityDetails}
                  onChange={(e) => setResponsibilityDetails(e.target.value)}
                  required
                  rows="4"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Assigned By</label>
                <input
                  type="text"
                  value={responsibilityAssignedBy}
                  onChange={(e) => setResponsibilityAssignedBy(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setShowResponsibilityUpdate(false)}
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
                  value={awardName}
                  onChange={(e) => setAwardName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Awarded By</label>
                <input
                  type="text"
                  value={awardedBy}
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

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Others;
