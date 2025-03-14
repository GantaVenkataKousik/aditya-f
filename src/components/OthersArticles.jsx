import React from 'react'
import { useState, useEffect } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
const OthersArticles = ({ Id }) => {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/article/othersArticles/${Id}`);
        if (response.ok) {
          const data = await response.json();
          setArticles(data);
          console.log("Fetched data:", data);
        }
        else {
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
    fetchData();
  }, [])

  const handleEdit = async (id) => {
    const data = await fetch(`http://localhost:5000/article/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (data.ok) {
      toast.success("Article updated successfully");
    } else {
      toast.error("Failed to update article");
    }
  };

  const handleDelete = async (id) => {
    const data = await fetch(`http://localhost:5000/article/delete/${id}`, {
      method: 'DELETE',
    });
    if (data.ok) {
      toast.success("Article deleted successfully");
    } else {
      toast.error("Failed to delete article");
    }
  };

  return (
    <>
      <ToastContainer />
      <div style={{ padding: '20px' }}>
        <h2>Articles Details:</h2>
        {articles.length > 0 ? (
          <div>
            {articles.map((article) => (
              <div
                key={article._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  padding: '15px',
                  marginBottom: '10px',
                  borderRadius: '5px',
                }}
              >
                <div>
                  <h3>{article.title}</h3>
                  <p>{article.content}</p>
                  <p>
                    <strong>Published Date:</strong>{' '}
                    {new Date(article.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleEdit(article._id)} style={{ width: 'auto' }}>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(article._id)} style={{ width: 'auto', backgroundColor: 'red', color: 'white' }}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No articles found.</p>
        )}
      </div>
    </>
  )
}

export default OthersArticles

