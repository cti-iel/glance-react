import React from "react";
import { Link } from "react-router-dom";
import "../styles/App.css";

function RegistrationPage() {
  return (
    <div className="auth-container">
      <h1>Register</h1>
      <form>
        <input type="text" placeholder="Name" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default RegistrationPage;
