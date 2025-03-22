import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Profile.css";
import { FaDownload, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = ({ lecturerDetails: initialDetails }) => {
  const [lecturerDetails, setLecturerDetails] = useState(initialDetails || {});
  const [loading, setLoading] = useState(!initialDetails);
  const [error, setError] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLecturerDetails = async () => {
      if (initialDetails) return;
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(`https://aditya-b.onrender.com/fetchData?userId=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setLecturerDetails(data);
        } else {
          setError("Failed to fetch lecturer details.");
        }
      } catch (err) {
        console.error("Error fetching lecturer details:", err);
        setError("An error occurred while fetching lecturer details.");
      } finally {
        setLoading(false);
      }
    };

    fetchLecturerDetails();
  }, [initialDetails]);

  const downloadProfilePDF = () => {
    const input = document.getElementById('profileContent');
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
      pdf.save(`profile_report_${currentDate}.pdf`);
    });
  };

  const handleEditClick = (field, value) => {
    setEditingField(field);
    setEditValue(value);
  };

  const handleUpdateField = async (field) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`https://aditya-b.onrender.com/fetchData/update-field/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          field,
          value: editValue
        }),
      });

      const data = await response.json();

      if (data.success) {
        setLecturerDetails(prev => ({
          ...prev,
          [field]: editValue
        }));
        toast.success(`${field} updated successfully`);
      } else {
        toast.error(data.message || 'Failed to update field');
      }
    } catch (error) {
      console.error("Error updating field:", error);
      toast.error("Failed to update field");
    } finally {
      setEditingField(null);
    }
  };

  const handleShowUpdateForm = () => {
    setFormData({
      fullName: lecturerDetails.fullName || '',
      email: lecturerDetails.email || '',
      EmpID: lecturerDetails.EmpID || '',
      designation: lecturerDetails.designation || '',
      department: lecturerDetails.department || '',
      JoiningDate: lecturerDetails.JoiningDate || '',
      UG: lecturerDetails.UG || '',
      UGYear: lecturerDetails.UGYear || '',
      PG: lecturerDetails.PG || '',
      PGYear: lecturerDetails.PGYear || '',
      Phd: lecturerDetails.Phd || '',
      PhdYear: lecturerDetails.PhdYear || '',
      Industry: lecturerDetails.Industry || '',
      OtherInst: lecturerDetails.OtherInstitution || '',
      OtherYear: lecturerDetails.OtherYear || '',
      TExp: lecturerDetails.TExp || '',
    });
    setShowUpdateForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`https://aditya-b.onrender.com/addUser`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Profile updated successfully');
        setShowUpdateForm(false);
        // Refresh lecturer details
        const updatedData = await response.json();
        setLecturerDetails(updatedData);
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const UpdateForm = () => (
    <div className="update-form-overlay">
      <form className="update-form" onSubmit={handleFormSubmit}>
        <h2>Update Profile</h2>
        <button
          type="button"
          className="close-button"
          onClick={() => setShowUpdateForm(false)}
        >
          ×
        </button>

        {/* General Information */}
        <h3>1. General Information</h3>
        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName || ''}
            onChange={handleFormChange}
          />
        </div>

        <div className="form-group">
          <label>Employee ID:</label>
          <input
            type="text"
            name="EmpID"
            value={formData.EmpID || ''}
            onChange={handleFormChange}
          />
        </div>

        <div className="form-group">
          <label>Designation:</label>
          <input
            type="text"
            name="designation"
            value={formData.designation || ''}
            onChange={handleFormChange}
          />
        </div>

        <div className="form-group">
          <label>Department:</label>
          <input
            type="text"
            name="department"
            value={formData.department || ''}
            onChange={handleFormChange}
          />
        </div>

        <div className="form-group">
          <label>Date of Joining:</label>
          <input
            type="date"
            name="JoiningDate"
            value={formData.JoiningDate || ''}
            onChange={handleFormChange}
          />
        </div>

        {/* Academic Qualifications */}
        <h3>2. Academic Qualifications</h3>

        <div className="qualification-section">
          <h4>Undergraduate</h4>
          <div className="form-group">
            <label>UG Institution:</label>
            <input
              type="text"
              name="UG"
              value={formData.UG || ''}
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label>UG Year:</label>
            <input
              type="text"
              name="UGYear"
              value={formData.UGYear || ''}
              onChange={handleFormChange}
            />
          </div>
        </div>

        <div className="qualification-section">
          <h4>Postgraduate</h4>
          <div className="form-group">
            <label>PG Institution:</label>
            <input
              type="text"
              name="PG"
              value={formData.PG || ''}
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label>PG Year:</label>
            <input
              type="text"
              name="PGYear"
              value={formData.PGYear || ''}
              onChange={handleFormChange}
            />
          </div>
        </div>

        <div className="qualification-section">
          <h4>PhD</h4>
          <div className="form-group">
            <label>PhD Details:</label>
            <input
              type="text"
              name="Phd"
              value={formData.Phd || ''}
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label>PhD Year:</label>
            <input
              type="text"
              name="PhdYear"
              value={formData.PhdYear || ''}
              onChange={handleFormChange}
            />
          </div>
        </div>

        <div className="qualification-section">
          <h4>Other Qualifications</h4>
          <div className="form-group">
            <label>Other Institution:</label>
            <input
              type="text"
              name="OtherInst"
              value={formData.OtherInst || ''}
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label>Other Year:</label>
            <input
              type="text"
              name="OtherYear"
              value={formData.OtherYear || ''}
              onChange={handleFormChange}
            />
          </div>
        </div>

        {/* Experience */}
        <h3>3. Experience</h3>
        <div className="form-group">
          <label>Industrial Experience:</label>
          <input
            type="text"
            name="Industry"
            value={formData.Industry || ''}
            onChange={handleFormChange}
          />
        </div>

        <div className="form-group">
          <label>Total Teaching Experience (years):</label>
          <input
            type="number"
            name="TExp"
            value={formData.TExp || ''}
            onChange={handleFormChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="save-button">Save Changes</button>
          <button type="button" className="cancel-button" onClick={() => setShowUpdateForm(false)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const renderEditableField = (label, field, value) => {
    return (
      <p style={{ marginLeft: "20px", marginBottom: "10px", padding: "10px" }}>
        <strong>{label}:&nbsp;&nbsp;&nbsp;&nbsp;</strong>
        {editingField === field ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              style={{
                padding: '2px 5px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <button
              onClick={() => handleUpdateField(field)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'green' }}
            >
              <FaCheck />
            </button>
            <button
              onClick={() => setEditingField(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red' }}
            >
              <FaTimes />
            </button>
          </span>
        ) : (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            {value}
            <button
              onClick={() => handleEditClick(field, value)}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              className="no-print"
            >
              <FaEdit />
            </button>
          </span>
        )}
      </p>
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="profile-container">
      <Navbar />
      <ToastContainer />
      <div className="profile-content" id="profileContent">
        <h1 style={{ fontFamily: "YourFontFamily", fontSize: "24px", fontWeight: "bold", padding: "25px" }}>
          PART A: Personal Information
        </h1>
        <div className='flex justify-end'>
          <button onClick={downloadProfilePDF} style={{ width: 'auto', margin: '20px', padding: '10px', fontSize: '16px', display: 'flex', alignItems: 'center' }} className='no-print'>
            <FaDownload style={{ marginRight: '8px' }} /> Profile
          </button>
        </div>
        <section className="profile-section">
          <h2>1. General Information</h2>
          {renderEditableField(
            "(a) Name with Emp ID",
            "fullName",
            `${lecturerDetails.fullName} (${lecturerDetails.EmpID})`
          )}
          {renderEditableField(
            "(b) Designation & Department",
            "designation",
            `${lecturerDetails.designation}, ${lecturerDetails.department}`
          )}
          {renderEditableField(
            "(c) Date of Joining",
            "JoiningDate",
            lecturerDetails.JoiningDate
          )}
        </section>

        <section className="profile-section">
          <h2>2. Academic Qualifications</h2>
          <table>
            <thead>
              <tr>
                <th>Qualification</th>
                <th>Institution</th>
                <th>Month & Year of Passing</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>UG</td>
                <td>
                  {editingField === 'UG' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        style={{ width: '100%' }}
                      />
                      <FaCheck onClick={() => handleUpdateField('UG')} style={{ cursor: 'pointer', color: 'green' }} />
                      <FaTimes onClick={() => setEditingField(null)} style={{ cursor: 'pointer', color: 'red' }} />
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {lecturerDetails.UG}
                      <FaEdit
                        onClick={() => handleEditClick('UG', lecturerDetails.UG)}
                        className="no-print"
                        style={{ cursor: 'pointer' }}
                      />
                    </span>
                  )}
                </td>
                <td>{lecturerDetails.UGYear}</td>
              </tr>
              <tr>
                <td>PG</td>
                <td>{lecturerDetails.PG}</td>
                <td>{lecturerDetails.PGYear}</td>
              </tr>
              <tr>
                <td>Ph.D. / Pursuing Ph.D</td>
                <td>{lecturerDetails.Phd || "N/A"}</td>
                <td>{lecturerDetails.PhdYear || "N/A"}</td>
              </tr>
              <tr>
                <td>Any Other</td>
                <td>{lecturerDetails.OtherInstitution || "N/A"}</td>
                <td>{lecturerDetails.OtherYear || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="profile-section">
          <h2>3. Experience</h2>
          {renderEditableField(
            "(a) Industrial Experience",
            "Industry",
            lecturerDetails.Industry || "N/A"
          )}
          {renderEditableField(
            "(b) Total Teaching Experience",
            "TExp",
            `${lecturerDetails.TExp} years`
          )}
          {renderEditableField(
            "(c) Date of Joining in Aditya",
            "JoiningDate",
            lecturerDetails.JoiningDate
          )}
        </section>

        <button
          className="update-button no-print"
          onClick={handleShowUpdateForm}
        >
          Update Details
        </button>
        {showUpdateForm && <UpdateForm />}
      </div>
    </div>
  );
};

export default Profile;
