import React from 'react';
import DisplayWorkshops from './DisplayWorkshops';
import { useNavigate } from 'react-router-dom';
import './Workshop.css';
import { FaPlus } from "react-icons/fa";

const Workshops = () => {
  const navigate = useNavigate();

  return (
    <div>
      
       <div >
    <div className="header">
      <h1 className="page-title"></h1>
     
    </div>
    <hr className="divider" />
    <DisplayWorkshops />
  </div>
  </div>
   
  );
};

export default Workshops;

