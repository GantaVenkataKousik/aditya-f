import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import '../tailwind.css'; // Adjust the path if needed
import './App.css';

// Import essential components directly
import Login from './Login';
import Welcome from './Welcome';
import Signup from './Signup';
import Logout from './logout';

// Images can be imported when needed in their components
import cseImage from '../images/cse.jpeg';
import eceImage from '../images/ece.jpg';
import eeImage from '../images/ee.jpeg';
import mechImage from '../images/mech.jpg';
import civilImage from '../images/civil.jpg';
import cheImage from '../images/che.jpeg';
import bioImage from '../images/bio.jpeg';

// Lazy load all other components
const Home = lazy(() => import('./Home'));
const Branch = lazy(() => import('./Branch'));
const Teacher = lazy(() => import('./Teacher'));
const Profile = lazy(() => import('./Profile'));
const UpdateUser = lazy(() => import('./UserUpdate'));
const AddResearch = lazy(() => import('./AddResearch'));
const SignupSuccess = lazy(() => import('./SignupSuccess'));
const Accept = lazy(() => import('./Accept'));
const UpdateClass = lazy(() => import('./UpdateClass'));
const Researchinfo = lazy(() => import('./Researchinfo'));
const Articles = lazy(() => import('./Articles'));
const AddArticle = lazy(() => import('./AddArticle'));
const Workshops = lazy(() => import('./Workshops'));
const About = lazy(() => import('./About'));
const Addworkshop = lazy(() => import('./AddWorkshop'));
const ClassInfo = lazy(() => import('./ClassInfo'));
const Sciarticles = lazy(() => import('./Sciarticles'));
const Wosarticles = lazy(() => import('./Wosarticles'));
const Proposals = lazy(() => import('./Proposals'));
const Papers = lazy(() => import('./Papers'));
const Books = lazy(() => import('./Books'));
const Chapters = lazy(() => import('./Chapters'));
const PatentsGranted = lazy(() => import('./PatentsGranted'));
const PatentsFiled = lazy(() => import('./PatentsFiled'));
const AddSciArticles = lazy(() => import('./AddSciArticles'));
const AddWosArticles = lazy(() => import('./AddWosArticles'));
const AddProposals = lazy(() => import('./AddProposals'));
const AddPapers = lazy(() => import('./AddPapers'));
const AddBooks = lazy(() => import('./AddBooks'));
const AddChapters = lazy(() => import('./AddChapters'));
const AddPGranted = lazy(() => import('./AddPGranted'));
const AddPFiled = lazy(() => import('./AddPFiled'));
const UpdateCla = lazy(() => import('./UpdateCla'));
const Carousal = lazy(() => import('./Carousal'));
const Others = lazy(() => import('./Others'));
const AddActivity = lazy(() => import('./Addactivity'));
const AddResponsibility = lazy(() => import('./Addresponsibility'));
const AddContribution = lazy(() => import('./Addcontribution'));
const AddAward = lazy(() => import('./Addaward'));
const DisplayAll = lazy(() => import('./DisplayAll'));
const HodTable = lazy(() => import('./HodTable'));
const FacultyScoreTable = lazy(() => import('./FacultyScoreTable'));
const UserList = lazy(() => import('./UserList'));

// Better loading component with proper structure
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  }}>
    <div>
      <div style={{ textAlign: 'center' }}>
        <div>Loading...</div>
      </div>
    </div>
  </div>
);

function App() {
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    setDepartments([
      { name: "CSE", description: "Focuses on AI", image: cseImage },
      { name: "ECE", description: "Focuses on Chip design", image: eceImage },
      { name: "EE", description: "Focuses on Circuits", image: eeImage },
      { name: "MECH", description: "Focuses on Machines", image: mechImage },
      { name: "CIVIL", description: "Focuses on Designs", image: civilImage },
      { name: "CHE", description: "Focuses on Chemicals", image: cheImage },
      { name: "BIO", description: "Focuses on Organics", image: bioImage },
    ]);

    const fetchData = async () => {
      try {
        const facultyData = await axios.get('https://aditya-b.onrender.com/fetchData/faculty');
        setFaculty(facultyData.data);
      } catch (error) {
        console.log('Error occurred:', error);
      }
    };

    fetchData();
  }, []);

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" />;
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-user" element={<UpdateUser />} />
        <Route path="/signup/signup" element={<SignupSuccess />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/addarticle" element={<AddArticle />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <Home faculty={faculty} departments={departments} />
          </ProtectedRoute>
        } />
        <Route
          path="/department/:branchName"
          element={
            <ProtectedRoute>
              <Branch faculty={faculty} />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/class" element={<UpdateClass />} />
        <Route path="/feedback" element={<UpdateCla />} />
        <Route path="/classes" element={<ClassInfo />} />
        <Route path="/teacher/:id" element={<Teacher faculty={faculty} />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/hodtable" element={<HodTable />} />
        <Route path="/addResearch" element={<AddResearch />} />
        <Route path="/addworkshop" element={<Addworkshop />} />
        <Route path="/facultyaprisaltable" element={<FacultyScoreTable />} />
        <Route path="/research" element={<Researchinfo />} />
        <Route path="/workshops" element={<Workshops />} />
        <Route path="/partb" element={<DisplayAll />} />
        <Route path="/sciarticles" element={<Sciarticles />} />
        <Route path="/wosarticles" element={<Wosarticles />} />
        <Route path="/proposals" element={<Proposals />} />
        <Route path="/papers" element={<Papers />} />
        <Route path="/books" element={<Books />} />
        <Route path="/chapters" element={<Chapters />} />
        <Route path="/patentsGranted" element={<PatentsGranted />} />
        <Route path="/patentsFiled" element={<PatentsFiled />} />

        <Route path="/sci-articles" element={<AddSciArticles />} />
        <Route path="/wos-articles" element={<AddWosArticles />} />
        <Route path="/addproposals" element={<AddProposals />} />
        <Route path="/addpapers" element={<AddPapers />} />
        <Route path="/addbooks" element={<AddBooks />} />
        <Route path="/addchapters" element={<AddChapters />} />
        <Route path="/addpgranted" element={<AddPGranted />} />
        <Route path="/addpfiled" element={<AddPFiled />} />
        <Route path="/ScoreTable" element={<FacultyScoreTable />} />
        <Route path="/others" element={<Others />} />
        <Route path="/addactivity" element={<AddActivity />} />
        <Route path="/addresponsibility" element={<AddResponsibility />} />
        <Route path="/addcontribution" element={<AddContribution />} />
        <Route path="/addaward" element={<AddAward />} />
        <Route path="/ccc" element={
          <Suspense fallback={<LoadingFallback />}>
            <Carousal />
          </Suspense>
        } />
        <Route path="/admin" element={<UserList />} />
      </Routes>
    </Suspense>
  );
}

export default App;
