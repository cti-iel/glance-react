/* import React from "react";
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
 */
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("authToken");
  const location = useLocation(); // Get the current location for potential redirects

  if (!token) {
    // Redirect to login page if token does not exist, preserving intended location
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children; // Render protected content if token exists
};

export default ProtectedRoute;
