import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserUpdate.css';

function AddUserForm() {
  const [formData, setFormData] = useState({
    email: '',
    EmpID: '',
    JoiningDate: '',
    Qualification: '',
    YearOfpass: '',
    UG: '',
    UGYear: '',
    PG: '',
    PGYear: '',
    Phd: '',
    PhdYear: '',
    Industry: '',
    OtherInst: '',
    OtherYear: '',
    TExp: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Convert negative numbers to positive for specific fields
    if (['YearOfpass', 'UGYear', 'PGYear', 'PhdYear', 'OtherYear', 'TExp'].includes(name)) {
      newValue = Math.abs(value);
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/add-user', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('User updated successfully');
        setFormData({
          email: '',
          EmpID: '',
          JoiningDate: '',
          Qualification: '',
          YearOfpass: '',
          UG: '',
          UGYear: '',
          PG: '',
          PGYear: '',
          Phd: '',
          PhdYear: '',
          Industry: '',
          OtherInst: '',
          OtherYear: '',
          TExp: '',
        });
        navigate('/profile');
      } else {
        alert('Failed to update user');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the user');
    }
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="EmpID">Employee ID:</label>
        <input type="text" id="EmpID" name="EmpID" value={formData.EmpID} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="JoiningDate">Joining Date:</label>
        <input type="date" id="JoiningDate" name="JoiningDate" value={formData.JoiningDate} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="Qualification">Qualification:</label>
        <input type="text" id="Qualification" name="Qualification" value={formData.Qualification} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="YearOfpass">Year of Passing:</label>
        <input type="text" id="YearOfpass" name="YearOfpass" value={formData.YearOfpass} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="UG">Undergraduate:</label>
        <input type="text" id="UG" name="UG" value={formData.UG} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="UGYear">Undergraduate Year:</label>
        <input type="text" id="UGYear" name="UGYear" value={formData.UGYear} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="PG">Postgraduate:</label>
        <input type="text" id="PG" name="PG" value={formData.PG} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="PGYear">Postgraduate Year:</label>
        <input type="text" id="PGYear" name="PGYear" value={formData.PGYear} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="Phd">PhD:</label>
        <input type="text" id="Phd" name="Phd" value={formData.Phd} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="PhdYear">PhD Year:</label>
        <input type="text" id="PhdYear" name="PhdYear" value={formData.PhdYear} onChange={handleChange} />
      </div>



      <div className="form-group">
        <label htmlFor="OtherInst">Other Institutions:</label>
        <input type="text" id="OtherInst" name="OtherInst" value={formData.OtherInst} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="OtherYear">Other Year:</label>
        <input type="text" id="OtherYear" name="OtherYear" value={formData.OtherYear} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="Industry">Industrial Experience (if any)</label>
        <input type="text" id="Industry" name="Industry" value={formData.Industry} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="TExp">Total Teaching experience (after PG)</label>
        <input type="number" id="TExp" name="TExp" value={formData.TExp} onChange={handleChange} />
      </div>

      <button className="submit-button" type="submit">Update User</button>
    </form>
  );
}

export default AddUserForm;