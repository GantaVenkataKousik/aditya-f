import React from 'react';
import { IoMdAdd } from 'react-icons/io';
import './Researchinfo.css';
import DisplayResearches from './DisplayResearches';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import ResearchText from './ResearchText';

const Researchinfo = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  return (
    <>
    <Navbar/>
     <div className="research-container">
      {/* <div className="header">
        <h1>My Researches</h1>
        <button 
          onClick={() => navigate('/addResearch', { state: { token } })} 
          className="add-button"
        >
          <IoMdAdd /> Add
        </button>
      </div> */}
      {/* <DisplayResearches /> */}
      <ResearchText/>
    </div>
    </>
   
  );
};

export default Researchinfo;
