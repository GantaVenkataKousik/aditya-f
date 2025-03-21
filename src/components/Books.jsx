import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Books = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState({
    bookDetails: '',
    ISBN: ''
  });

  const fetchBooks = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://aditya-b.onrender.com/research/books/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBooks(data || []); // Ensure we always set an array
      } else {
        toast.error("Error fetching books");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddClick = () => {
    setFormData({
      bookDetails: '',
      ISBN: ''
    });
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const handleUpdateClick = (book, index) => {
    setShowEditForm(true);
    setShowAddForm(false);
    setSelectedBook({ ...book, index });
    setFormData(book);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://aditya-b.onrender.com/research/books/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Book added successfully!");
        setShowAddForm(false);
        setBooks(prevBooks => [...prevBooks, formData]);
        fetchBooks();
      } else {
        toast.error(data.message || "Error adding book");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add book");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://aditya-b.onrender.com/research/books/${userId}/${selectedBook.index}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Book updated successfully!");
        setShowEditForm(false);
        setBooks(prevBooks => {
          const newBooks = [...prevBooks];
          newBooks[selectedBook.index] = formData;
          return newBooks;
        });
        fetchBooks();
      } else {
        toast.error(data.message || "Error updating book");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update book");
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://aditya-b.onrender.com/research/books/${userId}/${index}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Book deleted successfully!");
        setBooks(prevBooks => prevBooks.filter((_, i) => i !== index));
        fetchBooks();
      } else {
        toast.error(data.message || "Error deleting book");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete book");
    }
  };

  return (
    <div style={{ padding: '15px' }}>
      <ToastContainer />
      <div style={{ width: '90px', marginLeft: '1100px' }}>
        <button onClick={handleAddClick}> + Add</button>
      </div>
      <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '1rem' }}>
        Books Authored:
      </h3>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '1rem',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#d0e8f2', fontWeight: 'bold' }}>
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>S.No</th>
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Book details in IEEE format</th>
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>ISBN</th>
                <th style={{ padding: '0.5rem', border: '1px solid #000' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.length > 0 ? (
                books.map((book, index) => (
                  <tr key={index} style={{ textAlign: 'center' }}>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{index + 1}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{book.bookDetails || '-'}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #000' }}>{book.ISBN || '-'}</td>
                    <td style={{ display: 'flex', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleUpdateClick(book, index)} style={{ width: 'auto' }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(index)} style={{ width: 'auto', backgroundColor: 'red', color: 'white' }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>No books found</td>
                </tr>
              )}
            </tbody>
          </table>
          {showEditForm && (
            <div className="update-form">
              <h2>Update Book</h2>
              <form onSubmit={handleEdit}>
                <input type="text" name="bookDetails" value={formData.bookDetails} onChange={handleInputChange} placeholder="Book Details" required />
                <input type="text" name="ISBN" value={formData.ISBN} onChange={handleInputChange} placeholder="ISBN" required />
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setShowEditForm(false)}>Cancel</button>
              </form>
            </div>
          )}
          {showAddForm && (
            <div className="add-form">
              <h2>Add Book</h2>
              <form onSubmit={handleAddFormSubmit}>
                <input type="text" name="bookDetails" value={formData.bookDetails} onChange={handleInputChange} placeholder="Book Details" required />
                <input type="text" name="ISBN" value={formData.ISBN} onChange={handleInputChange} placeholder="ISBN" required />
                <button type="submit">Add Book</button>
                <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Books;
