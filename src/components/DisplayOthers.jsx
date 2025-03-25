import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DisplayCourses.css';

const DisplayOthers = ({ data }) => {
    // Update initial states with prop data
    const [activities, setActivities] = useState([]);
    const [responsibilities, setResponsibilities] = useState([]);
    const [contributions, setContributions] = useState([]);
    const [awards, setAwards] = useState([]);

    // States for forms
    const [showActivityForm, setShowActivityForm] = useState(false);
    const [showResponsibilityForm, setShowResponsibilityForm] = useState(false);
    const [showContributionForm, setShowContributionForm] = useState(false);
    const [showAwardForm, setShowAwardForm] = useState(false);

    // Form data states
    const [activityForm, setActivityForm] = useState({ activityDetails: '' });
    const [responsibilityForm, setResponsibilityForm] = useState({
        Responsibility: '',
        AssignedBy: ''
    });
    const [contributionForm, setContributionForm] = useState({
        contributionDetails: '',
        Benefit: ''
    });
    const [awardForm, setAwardForm] = useState({
        Award: '',
        AwardedBy: '',
        Level: '',
        Description: ''
    });

    // Selected item for editing
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        if (data) {
            setActivities(data.Activities || []);
            setResponsibilities(data.Responsibilities || []);
            setContributions(data.Contribution || []);
            setAwards(data.Awards || []);
        }
    }, [data]);

    // Generic form handlers
    const handleEdit = async (type, id, data) => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await fetch(`https://aditya-b.onrender.com/${type}/${userId}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                toast.success(`${type} updated successfully`);
                fetchData();
                closeAllForms();
            } else {
                toast.error(`Failed to update ${type}`);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(`Error updating ${type}`);
        }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

        try {
            const userId = localStorage.getItem('userId');
            const response = await fetch(`https://aditya-b.onrender.com/${type}/${userId}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                toast.success(`${type} deleted successfully`);
                fetchData();
            } else {
                toast.error(`Failed to delete ${type}`);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(`Error deleting ${type}`);
        }
    };

    const closeAllForms = () => {
        setShowActivityForm(false);
        setShowResponsibilityForm(false);
        setShowContributionForm(false);
        setShowAwardForm(false);
        setSelectedItem(null);
    };

    // Form components
    const ActivityForm = () => (
        <div className="form-overlay">
            <div className="form-container">
                <h2>{selectedItem ? 'Edit Activity' : 'Add Activity'}</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleEdit('activities', selectedItem?.id, activityForm);
                }}>
                    <textarea
                        name="activityDetails"
                        value={activityForm.activityDetails}
                        onChange={(e) => setActivityForm({ activityDetails: e.target.value })}
                        placeholder="Activity Details"
                        required
                    />
                    <div className="form-actions">
                        <button type="submit">Save</button>
                        <button type="button" onClick={closeAllForms}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );

    // Form components for each section
    const ResponsibilityForm = () => (
        <div className="form-overlay">
            <div className="form-container">
                <h2>{selectedItem ? 'Edit Responsibility' : 'Add Responsibility'}</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleEdit('responsibilities', selectedItem?.id, responsibilityForm);
                }}>
                    <textarea
                        name="Responsibility"
                        value={responsibilityForm.Responsibility}
                        onChange={(e) => setResponsibilityForm({
                            ...responsibilityForm,
                            Responsibility: e.target.value
                        })}
                        placeholder="Responsibility Details"
                        required
                    />
                    <input
                        type="text"
                        name="AssignedBy"
                        value={responsibilityForm.AssignedBy}
                        onChange={(e) => setResponsibilityForm({
                            ...responsibilityForm,
                            AssignedBy: e.target.value
                        })}
                        placeholder="Assigned By"
                        required
                    />
                    <div className="form-actions">
                        <button type="submit">Save</button>
                        <button type="button" onClick={closeAllForms}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );

    const ContributionForm = () => (
        <div className="form-overlay">
            <div className="form-container">
                <h2>{selectedItem ? 'Edit Contribution' : 'Add Contribution'}</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleEdit('contribution', selectedItem?.id, contributionForm);
                }}>
                    <textarea
                        name="contributionDetails"
                        value={contributionForm.contributionDetails}
                        onChange={(e) => setContributionForm({
                            ...contributionForm,
                            contributionDetails: e.target.value
                        })}
                        placeholder="Contribution Details"
                        required
                    />
                    <input
                        type="text"
                        name="Benefit"
                        value={contributionForm.Benefit}
                        onChange={(e) => setContributionForm({
                            ...contributionForm,
                            Benefit: e.target.value
                        })}
                        placeholder="Benefit to College/Department"
                        required
                    />
                    <div className="form-actions">
                        <button type="submit">Save</button>
                        <button type="button" onClick={closeAllForms}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );

    const AwardForm = () => (
        <div className="form-overlay">
            <div className="form-container">
                <h2>{selectedItem ? 'Edit Award' : 'Add Award'}</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleEdit('awards', selectedItem?.id, awardForm);
                }}>
                    <input
                        type="text"
                        name="Award"
                        value={awardForm.Award}
                        onChange={(e) => setAwardForm({
                            ...awardForm,
                            Award: e.target.value
                        })}
                        placeholder="Award Name"
                        required
                    />
                    <input
                        type="text"
                        name="IssuingOrg"
                        value={awardForm.AwardedBy}
                        onChange={(e) => setAwardForm({
                            ...awardForm,
                            AwardedBy: e.target.value
                        })}
                        placeholder="Issuing Organization"
                        required
                    />
                    <input
                        type="text"
                        name="Level"
                        value={awardForm.Level}
                        onChange={(e) => setAwardForm({
                            ...awardForm,
                            Level: e.target.value
                        })}
                        placeholder="Level"
                        required
                    />
                    <textarea
                        name="Description"
                        value={awardForm.Description}
                        onChange={(e) => setAwardForm({
                            ...awardForm,
                            Description: e.target.value
                        })}
                        placeholder="Description"
                        required
                    />
                    <div className="form-actions">
                        <button type="submit">Save</button>
                        <button type="button" onClick={closeAllForms}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <div className="display-others-container">
            <ToastContainer />

            {/* Activities Section */}
            <section className="data-section">
                <h2>6.Outreach Activities</h2>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Activity Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activities.map((activity, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{activity.activityDetails}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Responsibilities Section */}
            <section className="data-section">
                <h2>7.Additional Responsibilities</h2>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Responsibility</th>
                            <th>Assigned By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {responsibilities.map((resp, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{resp.Responsibility}</td>
                                <td>{resp.AssignedBy}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Contributions Section */}
            <section className="data-section">
                <h2>8.Special Contributions</h2>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Contribution Details</th>
                            <th>Benefit to College/Department</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contributions.map((cont, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{cont.contributionDetails}</td>
                                <td>{cont.Benefit}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Awards Section */}
            <section className="data-section">
                <h2>9.Awards Received</h2>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Award Name</th>
                            <th>Awarded By</th>
                            <th>Level</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {awards.map((award, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{award.Award}</td>
                                <td>{award.AwardedBy}</td>
                                <td>{award.Level}</td>
                                <td>{award.Description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Forms */}
            {showActivityForm && <ActivityForm />}
            {showResponsibilityForm && <ResponsibilityForm />}
            {showContributionForm && <ContributionForm />}
            {showAwardForm && <AwardForm />}
        </div>
    );
};

export default DisplayOthers; 