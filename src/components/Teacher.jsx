import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import DisplayCourses from './DisplayCourses';
import DisplayFeedback from './DisplayFeedback';
import ProctoringTable from './DisplayProctoring';
import ResearchText from './ResearchText';
import DisplayWorkshops from './DisplayWorkshops';
import DisplayOthers from './DisplayOthers';
const Teacher = ({ faculty }) => {
  const { id } = useParams();
  const teacher = faculty.find((teacher) => teacher._id === id);
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await fetch(`https://aditya-b.onrender.com/fetchdata/teachers/${id}`);
        const result = await response.json();
        console.log(result);
        if (result.success) {
          setTeacherData(result.data);
          console.log(result.data);
        } else {
          setError('Failed to fetch teacher data.');
        }
      } catch (err) {
        console.error('Error fetching teacher data:', err);
        setError('An error occurred while fetching teacher data.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [id]);

  if (!teacher) return <p>Teacher not found.</p>;

  return (
    <div style={styles.pageContainer}>
      <Navbar />

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
                data={{
                  workshops: teacherData.workshop,
                  totalMarks: 18,
                }}
              />
            </div>
            <div>

              <DisplayOthers data={teacherData?.others} />
            </div>
          </>
        )}

      </div>
    </div>
  );
};

const styles = {


};

export default Teacher;
