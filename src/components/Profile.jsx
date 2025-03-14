import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Profile.css";
import { FaDownload } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
const Profile = ({ lecturerDetails: initialDetails }) => {
  const [lecturerDetails, setLecturerDetails] = useState(initialDetails || {});
  const [loading, setLoading] = useState(!initialDetails);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLecturerDetails = async () => {
      if (initialDetails) return;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/fetchData", {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="profile-container">
      <Navbar />
      <div className="profile-content" id="profileContent">
        {/* General Information */}
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
          <p style={{ marginLeft: "20px", marginBottom: "10px", padding: "10px" }}>
            <strong>
              (a)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Name with Emp ID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;
            </strong>{" "}
            {lecturerDetails.fullName} ({lecturerDetails.EmpID})
          </p>
          <p style={{ marginLeft: "20px", marginBottom: "10px", padding: "10px" }}>
            <strong>
              (b)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Designation & Department&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;
            </strong>{" "}
            {lecturerDetails.designation}, {lecturerDetails.department}
          </p>
          <p style={{ marginLeft: "20px", marginBottom: "10px", padding: "10px" }}>
            <strong>
              (c)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Date of Joining&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;
            </strong>{" "}
            {lecturerDetails.JoiningDate}
          </p>
        </section>

        {/* Academic Qualifications */}
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

        {/* Experience */}
        <section className="profile-section">
          <h2>3. Experience</h2>
          <p style={{ marginLeft: "20px", marginBottom: "10px", padding: "10px" }}>
            <strong>
              (a)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Industrial Experience (if any)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;
            </strong>{" "}
            {lecturerDetails.Industry || "N/A"}
          </p>
          <p style={{ marginLeft: "20px", marginBottom: "10px", padding: "10px" }}>
            <strong>
              (b)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Total Teaching Experience (after PG)&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;
            </strong>{" "}
            {lecturerDetails.TExp} years
          </p>
          <p style={{ marginLeft: "20px", marginBottom: "10px", padding: "10px" }}>
            <strong>
              (c)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date of Joining in Aditya&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;
            </strong>{" "}
            {lecturerDetails.JoiningDate}
          </p>
        </section>

        {/* Update Button */}
        <button className="update-button no-print" onClick={() => navigate("/add-user")}>
          Update Details
        </button>
        {/* Download Button */}
      </div>
    </div>
  );
};

export default Profile;
