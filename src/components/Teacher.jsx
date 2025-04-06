import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import DisplayCourses from './DisplayCourses';
import DisplayFeedback from './DisplayFeedback';
import ProctoringTable from './DisplayProctoring';
import ResearchText from './ResearchText';
import DisplayWorkshops from './DisplayWorkshops';
import Others from './Others';
import Profile from './Profile';
import FacultyScoreTable from './FacultyScoreTable';
import { FaDownload } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const Teacher = ({ faculty }) => {
  const { id } = useParams();
  console.log(id);
  const teacher = faculty.find((teacher) => teacher._id === id);
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lecturerDetails, setLecturerDetails] = useState(null);

  const downloadPDF = () => {
    const input = document.getElementById('teacherContent');
    if (!input) {
      console.error('Element with id "teacherContent" not found.');
      return;
    }

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

      const teacherName = lecturerDetails?.fullName || 'teacher';
      const currentDate = new Date().toISOString().split('T')[0];
      pdf.save(`${teacherName}_report_${currentDate}.pdf`);

      // Restore visibility after PDF generation
      noPrintElements.forEach(el => {
        el.style.display = '';
      });
    }).catch((error) => {
      console.error('Error generating PDF:', error);
      // Restore visibility even if there's an error
      noPrintElements.forEach(el => {
        el.style.display = '';
      });
    });
  };

  const fetchLecturerDetails = async () => {
    try {
      const response = await fetch(`https://aditya-b.onrender.com/fetchData?userId=${id}`, {
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
    };
  }

  const fetchTeacherData = async () => {
    try {
      const response = await fetch(`https://aditya-b.onrender.com/fetchData/teachers/${id}`);
      const result = await response.json();
      if (result.success) {
        setTeacherData(result.data);
      }
    } catch (err) {
      console.error('Error fetching teacher data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchTeacherData();
  };

  useEffect(() => {
    fetchLecturerDetails();
    fetchTeacherData();
  }, [id]);

  if (!teacher) return <p>Teacher not found.</p>;

  return (
    <div style={styles.pageContainer}>
      <Navbar />

      <div id="teacherContent">
        {/* Download button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px' }}>
          <button
            onClick={downloadPDF}
            className="no-print"
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#007bff')}
          >
            <FaDownload style={{ marginRight: '8px' }} /> Download Report
          </button>
        </div>

        <div style={styles.contentContainer}>
          {lecturerDetails && <Profile lecturerDetails={lecturerDetails} id={id} />}
        </div>

        <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '20px' }}>PART B</h2>

        <div style={styles.contentContainer}>
          {loading && <p>Loading teacher data...</p>}
          {error && <p style={styles.error}>{error}</p>}

          {teacherData && (
            <>
              <div>
                <h2>1. Courses Average Pass Percentage:</h2>
                <DisplayCourses
                  coursesData={teacherData?.classes}
                  onDataChange={refreshData}
                  userId={id}
                  viewMode={true}
                />
              </div>
              <div>
                <h2>2. Course Feedback:</h2>
                <DisplayFeedback feedbackData={teacherData?.feedback} onDataChange={refreshData} userId={id} />
              </div>
              <div>
                <h2>3. Proctoring:</h2>
                <ProctoringTable proctoringData={teacherData?.proctoring} onDataChange={refreshData} userId={id} />
              </div>
              <div>
                <ResearchText data={teacherData?.research} onDataChange={refreshData} userId={id} />
              </div>
              <div>
                <DisplayWorkshops data={teacherData.workshop} onDataChange={refreshData} userId={id} />
              </div>
              <div>
                <Others data={teacherData.others[0]} onDataChange={refreshData} userId={id} />
              </div>
            </>
          )}
        </div>

        <div>
          <FacultyScoreTable appraisalData={teacherData?.appraisal} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    margin: 'auto',
    padding: '20px',
    maxWidth: '1200px',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  }
};

export default Teacher;
