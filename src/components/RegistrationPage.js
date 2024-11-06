import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../styles/App.css";

const RegistrationPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegistration = async (e) => {
    e.preventDefault();
    console.log("Registration form submitted");

    try {
      const response = await axios.post("/api/users/signup", {
        username: username,
        password: password,
      });
      console.log("Response received", response);

      if (response.status === 201) {
        // Check if the status code is 201 (Created)
        alert("Registration successful. Return to login page to login");
      } else {
        alert("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response && error.response.status === 409) {
        alert("Username already in use. Please choose a different username.");
      } else {
        alert("An error occurred during registration");
      }
    }
  };

  return (
    <div className="auth-container">
      <h1>Register</h1>
      <form onSubmit={handleRegistration}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
};

export default RegistrationPage;
