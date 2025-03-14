import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserButton = ({ lecturerDetails: initialDetails }) => {
  const [lecturerDetails, setLecturerDetails] = useState(initialDetails || {});
  const [loading, setLoading] = useState(!initialDetails);
  const [error, setError] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchButtonState = async () => {
      try {
        const response = await fetch("http://localhost:5000/settings/get-button-state");
        const data = await response.json();
        setIsDisabled(data.updateButtonDisabled);
      } catch (error) {
        console.error("Error fetching button state:", error);
      }
    };

    fetchButtonState();
  }, []);

  const handleUpdateClick = () => {
    navigate("/add-user");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="profile-container">
      <h1>Profile Page</h1>
      <button className="update-button" onClick={handleUpdateClick} disabled={isDisabled}>
        Update Details
      </button>
    </div>
  );
};

export default UserButton;
