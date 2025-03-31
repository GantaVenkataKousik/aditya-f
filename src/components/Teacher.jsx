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
const Teacher = ({ faculty }) => {
  const { id } = useParams();
  const teacher = faculty.find((teacher) => teacher._id === id);
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lecturerDetails, setLecturerDetails] = useState(null);
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

  useEffect(() => {
    fetchLecturerDetails();
    fetchTeacherData();
  }, [id]);

  if (!teacher) return <p>Teacher not found.</p>;

  return (
    <div style={styles.pageContainer}>
      <Navbar />

      <div style={styles.contentContainer}>
        {lecturerDetails && <Profile lecturerDetails={lecturerDetails} />}
      </div>
      <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '20px' }}>PART B</h2>
      <div style={styles.contentContainer}>
        {loading && <p>Loading teacher data...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {teacherData && (
          <>
            <div>
              <h2>1. Courses Average Pass Percentage:</h2>
              <DisplayCourses coursesData={teacherData?.classes} />
            </div>
            <div>
              <h2>2. Course Feedback:</h2>
              <DisplayFeedback feedbackData={teacherData?.feedback} />
            </div>
            <div>
              <h2>3. Proctoring:</h2>
              <ProctoringTable proctoringData={teacherData?.proctoring} />
            </div>
            <div>
              <ResearchText data={teacherData?.research} />
            </div>
            <div>
              <DisplayWorkshops
                data={teacherData.workshop}
              />
            </div>
            <div>
              <Others data={teacherData.others[0]} />
            </div>
          </>
        )}

      </div>
      <div>
        <FacultyScoreTable appraisalData={teacherData?.appraisal} />
      </div>
    </div>
  );
};


const styles = {


};

export default Teacher;
