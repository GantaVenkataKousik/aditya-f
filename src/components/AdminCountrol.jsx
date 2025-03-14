import React, { useState, useEffect } from "react";

const AdminControl = () => {
  const [isDisabled, setIsDisabled] = useState(false);

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

  const toggleButtonState = async () => {
    try {
      const newState = !isDisabled;
      await fetch("http://localhost:5000/settings/set-button-state", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updateButtonDisabled: newState }),
      });

      setIsDisabled(newState);
      alert(`Update Details button is now ${newState ? "DISABLED" : "ENABLED"}`);
    } catch (error) {
      console.error("Error updating button state:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Admin Panel: Control Update Button</h2>
      <button onClick={toggleButtonState} style={{ padding: "10px" }}>
        {isDisabled ? "Enable Update Details Button" : "Disable Update Details Button"}
      </button>
    </div>
  );
};

export default AdminControl;
