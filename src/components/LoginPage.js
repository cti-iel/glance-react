import React from "react";
import { Link } from "react-router-dom";
import "../styles/App.css";

function LoginPage() {
  return (
    <div className="auth-container">
      <h1>Login</h1>
      <form>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default LoginPage;
