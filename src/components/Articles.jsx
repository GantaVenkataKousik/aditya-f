import React from 'react';
import DisplayArticles from './DisplayArticles';
import { useNavigate } from 'react-router-dom';
import './Articles.css';
import { FaPlus } from "react-icons/fa";
import Navbar from './Navbar';

const Articles = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar/>
       <div className="articles-container">
    <div className="header">
      <h1 className="page-title">Articles</h1>
      <button
        className="post-button"
        onClick={() => navigate('/addarticle')}
      >
      <FaPlus />  Post
      </button>
    </div>
    <hr className="divider" />
    <DisplayArticles />
  </div>
  </div>
   
  );
};

export default Articles;
