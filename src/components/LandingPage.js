import React from "react";
import { Link } from "react-router-dom";
import "../styles/App.css";

function LandingPage() {
  const backgroundImageStyle = {
    backgroundImage: "url(/glance-2.jpg)", // Absolute path to the public folder
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh", // Ensure it takes the full viewport height
  };

  return (
    <div className="landing-container">
      <div className="logo-section" style={backgroundImageStyle}>
        {/*         <p className="landing-text">Industrial Video Analytics at Scale</p>
        <p className="landing-text-top">Glance</p> */}
      </div>
      <div className="login-section">
        <h2>Glance</h2>
        <p className="subtitle">Industrial Video Analytics at Scale</p>
        <form>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
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
}

export default LandingPage;
