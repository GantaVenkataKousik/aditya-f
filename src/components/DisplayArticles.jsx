import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiFillLike, AiFillDislike } from "react-icons/ai";

const DisplayArticles = () => {
  const [articles, setArticles] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:5000/article/data', { 
          method: 'GET',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          // Add initial likes and dislikes to the articles
          const updatedData = data.map(article => ({
            ...article,
            likes: article.likes || 0,
            dislikes: article.dislikes || 0,
          }));
          setArticles(updatedData);
        } else {
          console.error('Failed to fetch articles:', response.statusText);
        }
      } catch (error) {
        console.error('Error occurred:', error);
      }
    };

    fetchArticles();
  }, [token]); 

  const handleLike = async (articleId) => {
    setArticles(prevArticles =>
      prevArticles.map(article =>
        article._id === articleId
          ? { ...article, likes: article.likes + 1 }
          : article
      )
    );

    // Update like count on the server
    try {
      await fetch(`http://localhost:5000/article/${articleId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleDislike = async (articleId) => {
    setArticles(prevArticles =>
      prevArticles.map(article =>
        article._id === articleId
          ? { ...article, dislikes: article.dislikes + 1 }
          : article
      )
    );

    // Update dislike count on the server
    try {
      await fetch(`http://localhost:5000/article/${articleId}/dislike`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error updating dislike:', error);
    }
  };

  return (
    <div className="articles-list">
      {articles.length > 0 ? (
        articles.map((article) => (
          <div key={article._id} className="article-card" style={articleCardStyle}>
            <Link to={`/read/${article._id}`}>
              <h2 className="article-title" style={titleStyle}>{article.title}</h2>
            </Link>
            <div className="author-info" style={authorInfoStyle}>
              <p><strong>Author:</strong> {article.userDetails?.fullName}</p>
              <p><strong>Email:</strong> {article.userDetails?.email}</p>
              <p><strong>Department:</strong> {article.userDetails?.department}</p>
            </div>
            <div className="article-actions" style={actionsStyle}>
              <button
                className="like-button"
                onClick={() => handleLike(article._id)}
                style={likeButtonStyle}
              >
                <AiFillLike /> {article.likes}
              </button>
              <button
                className="dislike-button"
                onClick={() => handleDislike(article._id)}
                style={dislikeButtonStyle}
              >
                <AiFillDislike /> {article.dislikes}
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No articles found.</p>
      )}
    </div>
  );
};

const articleCardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '15px',
  margin: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#f9f9f9',
};

const titleStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '10px',
};

const authorInfoStyle = {
  marginTop: '15px',
  fontSize: '14px',
  color: '#333',
};

const actionsStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '15px',
  gap:'20px'
};

const likeButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  width:'80px'
};

const dislikeButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
   width:'80px'
};

export default DisplayArticles;
