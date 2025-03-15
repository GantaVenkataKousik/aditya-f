import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import '../tailwind.css'; // Adjust the path if needed
import Login from './Login';
import Home from './Home';
import Welcome from './Welcome';
import Signup from './Signup';
import Branch from './Branch';
import Teacher from './Teacher';
import Profile from './Profile';
import Logout from './logout';
import UpdateUser from './UserUpdate';
import AddResearch from './AddResearch';
import SignupSuccess from './SignupSuccess';
import Accept from './Accept';
import UpdateClass from './UpdateClass';
import DisplayClasses from './DisplayClasses';
import Researchinfo from './Researchinfo';
import Articles from './Articles';
import AddArticle from './AddArticle';
import cseImage from '../images/cse.jpeg';
import eceImage from '../images/ece.jpg';
import eeImage from '../images/ee.jpeg';
import mechImage from '../images/mech.jpg';
import civilImage from '../images/civil.jpg';
import cheImage from '../images/che.jpeg';
import bioImage from '../images/bio.jpeg';
import Workshops from './Workshops';
import About from './About';
import Addworkshop from './AddWorkshop';
import ClassInfo from './ClassInfo';
import ResearchText from './ResearchText';
import Sciarticles from './Sciarticles';
import Wosarticles from './Wosarticles';
import Proposals from './Proposals';
import Papers from './Papers';
import Books from './Books';
import Chapters from './Chapters';
import PatentsGranted from './PatentsGranted';
import PatentsFiled from './PatentsFiled';
import AddSciArticles from './AddSciArticles';
import AddWosArticles from './AddWosArticles';
import AddProposals from './AddProposals';
import AddPapers from './AddPapers';
import AddBooks from './AddBooks';
import AddChapters from './AddChapters';
import AddPGranted from './AddPGranted';
import AddPFiled from './AddPFiled';
import UpdateCla from './UpdateCla';
import Carousal from './Carousal'
import Others from './Others';
import AddActivity from './Addactivity';
import AddResponsibility from './Addresponsibility';
import AddContribution from './Addcontribution';
import AddAward from './Addaward';
import DisplayAll from './DisplayAll';
import ProctoringForm from './ProctoringForm';
import HodTable from './HodTable';
import FacultyScoreTable from './FacultyScoreTable';
import UserList from './UserList';
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
        console.log(faculty);
      } catch (error) {
        console.log('Error occurred:', error);
      }
    };

    fetchData();

  }, []);

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/signin" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/add-user" element={<UpdateUser />} />
      <Route path="/signup/signup" element={<SignupSuccess />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/addarticle" element={<AddArticle />} />
      <Route
        path="/home"
        element={<Home faculty={faculty} departments={departments} />}
      />
      <Route
        path="/department/:branchName"
        element={<Branch faculty={faculty} />}
      />
      <Route
        path="/about"
        element={<About />}
      />
      <Route
        path="/profile"
        element={<Profile />}
      />
      <Route
        path="/class"
        element={<UpdateClass />}
      />
      <Route
        path="/feedback"
        element={<UpdateCla />}
      />
      <Route
        path="/classes"
        element={<ClassInfo />}
      />
      <Route
        path="/teacher/:id"
        element={<Teacher faculty={faculty} />}
      />
      <Route
        path="/logout"
        element={<Logout />}
      />
      <Route
        path="/hodtable"
        element={<HodTable />}
      />
      <Route
        path="/addResearch"
        element={<AddResearch />}
      />
      <Route
        path="/addworkshop"
        element={<Addworkshop />}
      />
      <Route
        path="/facultyaprisaltable"
        element={<FacultyScoreTable />}
      />
      <Route
        path="/research"
        element={<Researchinfo />}
      />
      <Route
        path="/workshops"
        element={<Workshops />}
      />
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
      <Route path="/ccc" element={<Carousal />} />
      <Route path="/admin" element={<UserList />} />
    </Routes>
  );
}

export default App;
