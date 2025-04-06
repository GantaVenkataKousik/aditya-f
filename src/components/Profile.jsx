import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import "./Profile.css";
import { FaDownload, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = ({ lecturerDetails: initialDetails }) => {
  const params = useParams();
  const { id: paramId, userId: paramUserId } = params;
  const [lecturerDetails, setLecturerDetails] = useState(initialDetails || {});
  const [loading, setLoading] = useState(!initialDetails);
  const [error, setError] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const activeInputRef = useRef(null);

  const getUserId = () => {
    if (paramId) {
      return paramId;
    } else {
      return localStorage.getItem("userId");
    }
  };

  const fetchLecturerDetails = async () => {
    try {
      setLoading(true);
      let userId = getUserId();

      if (!userId) {
        setError("User ID not found. Please login again.");
        return;
      }

      const response = await fetch(`https://aditya-b.onrender.com/fetchData?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
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

  useEffect(() => {
    fetchLecturerDetails();
  }, []);

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
      const userId = getUserId();
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
      }
    } catch (error) {
      console.error("Error updating field:", error);
    } finally {
      setEditingField(null);
    }
  };

  const handleUpdateFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = getUserId();

      // Send the complete formData object to update all fields at once
      const response = await fetch(`https://aditya-b.onrender.com/fetchData/update-field/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh the lecturer details
        fetchLecturerDetails();
        toast.success("Profile updated successfully");
        setShowUpdateForm(false);
      } else {
        // Display the specific error message from the server
        toast.error(data.message || "Failed to update profile");
        console.error("Update error:", data);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile. Please try again.");
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

    // Capture cursor position
    const cursorPosition = e.target.selectionStart;

    // Save the current scroll position
    const scrollPosition = modalRef.current?.scrollTop;

    // Save the active input
    const activeElement = e.target;

    // Update form data with minimal re-rendering
    setFormData(prev => {
      const newData = { ...prev };

      if (name === 'JoiningDate' && value) {
        newData[name] = new Date(value).toISOString().split('T')[0];
      } else {
        newData[name] = value;
      }

      return newData;
    });

    // Use a more immediate approach to restore focus
    requestAnimationFrame(() => {
      // Restore scroll position
      if (modalRef.current) {
        modalRef.current.scrollTop = scrollPosition;
      }

      // Restore focus and cursor position
      if (activeElement) {
        activeElement.focus();
        activeElement.setSelectionRange(cursorPosition, cursorPosition);
      }
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = getUserId();
      const response = await fetch(`https://aditya-b.onrender.com/addUser?userId=${userId}`, {
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
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const UpdateForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="text-xl font-bold mb-0">Update Profile</h2>
          <button
            onClick={() => setShowUpdateForm(false)}
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

        <form
          onSubmit={handleUpdateFormSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
        >
          <div
            ref={modalRef}
            style={{
              overflow: 'auto',
              maxHeight: '70vh',
              padding: '10px'
            }}
            className="form-content-scrollable"
          >
            {/* General Information */}
            <h3 className="text-lg font-semibold mb-3 mt-2">1. General Information</h3>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Full Name:</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName || ''}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Employee ID:</label>
              <input
                type="text"
                name="EmpID"
                value={formData.EmpID || ''}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Designation:</label>
              <input
                type="text"
                name="designation"
                value={formData.designation || ''}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Department:</label>
              <input
                type="text"
                name="department"
                value={formData.department || ''}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Date of Joining:</label>
              <input
                type="date"
                name="JoiningDate"
                value={formData.JoiningDate || ''}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Academic Qualifications */}
            <h3 className="text-lg font-semibold mb-3 mt-5">2. Academic Qualifications</h3>

            <div className="mb-4">
              <h4 className="font-medium mb-2">Undergraduate</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">UG Institution:</label>
                  <input
                    type="text"
                    name="UG"
                    value={formData.UG || ''}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">UG Year:</label>
                  <input
                    type="text"
                    name="UGYear"
                    value={formData.UGYear || ''}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">Postgraduate</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">PG Institution:</label>
                  <input
                    type="text"
                    name="PG"
                    value={formData.PG || ''}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">PG Year:</label>
                  <input
                    type="text"
                    name="PGYear"
                    value={formData.PGYear || ''}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">PhD</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">PhD Details:</label>
                  <input
                    type="text"
                    name="Phd"
                    value={formData.Phd || ''}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">PhD Year:</label>
                  <input
                    type="text"
                    name="PhdYear"
                    value={formData.PhdYear || ''}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">Other Qualifications</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Other Institution:</label>
                  <input
                    type="text"
                    name="OtherInst"
                    value={formData.OtherInst || ''}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Other Year:</label>
                  <input
                    type="text"
                    name="OtherYear"
                    value={formData.OtherYear || ''}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>

            {/* Experience */}
            <h3 className="text-lg font-semibold mb-3 mt-5">3. Experience</h3>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Industrial Experience:</label>
              <input
                type="text"
                name="Industry"
                value={formData.Industry || ''}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Total Teaching Experience (years):</label>
              <input
                type="number"
                name="TExp"
                value={formData.TExp || ''}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => setShowUpdateForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderEditableField = (label, field, value) => {
    return (
      <p style={{ marginLeft: "20px", marginBottom: "10px", padding: "10px" }}>
        <strong>{label}:&nbsp;&nbsp;&nbsp;&nbsp;</strong>
        <span>{value}</span>
      </p>
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="profile-container">
      {!initialDetails && <Navbar />}
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
                <td>{lecturerDetails.UG}</td>
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
