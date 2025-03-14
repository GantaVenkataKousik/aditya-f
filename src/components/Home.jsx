import React from 'react';
import Navbar from './Navbar';
import Faculty from './Faculty';
import Departments from './Departments';
import Footer from './Footer';
import Header from './Header';
import Carousal from './Carousal';
import { useState,useEffect } from 'react';
import DisplayClasses from './DisplayClasses';
import FacultyScoreTable from './FacultyScoreTable';
import HoDTable from './HodTable';
const Home = (props) => {
  const faculty = props.faculty;
  const departments = props.departments;
  const [user,setUser]=useState({});
   useEffect(() => {
      const fetchUser = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:5000/fetchData', { 
            method: 'GET',
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else {
            console.error('Failed to fetch user:', response.statusText);
          }
        } catch (error) {
          console.error('Error occurred:', error);
        }
      };
      fetchUser();
    }, []);
    
  

  return (
    <div>
      <Header />
      <Navbar />
      <Carousal role={user.designation}/>
      <div className='m-2 p-1'>
        {/* <div>
        {user.designation === 'Faculty' && <FacultyScoreTable user={user}/>}
        {user.designation === 'HOD' && <FacultyScoreTable user={user}/>}
          <Faculty faculty={faculty} />
        </div> */}
       
       
        {user.designation==='HOD' && <div><Faculty faculty={faculty} /></div>}
        {user.designation==='Dean' && <div>
          <Departments departments={departments} />
        </div>}
     
      </div>
      <Footer />
    </div>
  );
};

export default Home;
