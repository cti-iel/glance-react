import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("authToken");

  if (!token) {
    // Redirect to login page if token does not exist
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
