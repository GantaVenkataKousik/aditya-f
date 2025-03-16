import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddArticle = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newArticle = {
      title,
      content,
      createdAt: new Date(),
    };
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://aditya-b.onrender.com/add-article?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newArticle),
      });

      if (response.ok) {
        alert('Article posted successfully');
        setTitle('');
        setContent('');
        console.log('Article added:', newArticle);
        navigate('/articles');

      } else {
        alert('Failed to post');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while posting an article');
    }

  };

  return (
    <div className="add-article-container">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="post-button">
          Add Article
        </button>
      </form>
    </div>
  );
};

export default AddArticle;
