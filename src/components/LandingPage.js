import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { UserContext } from "./UserContext";

import { useNavigate } from "react-router-dom";

import "../styles/App.css";

const LandingPage = () => {
  const backgroundImageStyle = {
    backgroundImage: "url(/glance-2.jpg)", // Absolute path to the public folder
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh", // Ensure it takes the full viewport height
  };

  const { setUsername } = useContext(UserContext);
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login form submitted");

    const formData = new FormData();
    formData.append("username", usernameInput);
    formData.append("password", password);

    console.log("FormData created");
    try {
      const response = await axios.post("/api/users/token", formData);

      if (response.data.access_token) {
        console.log(
          "Access Token stored in cookie:",
          response.data.access_token
        );

        // Set the token in a cookie
        Cookies.set("authToken", response.data.access_token, {
          expires: 1, // 1 day expiration, adjust as needed
          secure: true, // Ensure this is true if you're using HTTPS
          sameSite: "Strict", // Adjust based on your cross-site requirements
        });

        setUsername(usernameInput);
        // Navigate to the upload page
        navigate("/glance/dashboard");
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login");
    }
  };

  return (
    <div className="landing-container">
      <div className="logo-section" style={backgroundImageStyle}></div>
      <div className="login-section">
        <h2>Glance</h2>
        <p className="subtitle">Industrial Video Analytics at Scale: xoxo</p>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Next</button>
        </form>
        <p>
          Don't have an account?{" "}
          <Link to="/register" className="register-link">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
