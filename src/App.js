/* import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Glance from "./components/Glance";
import RegistrationPage from "./components/RegistrationPage";
import LandingPage from "./components/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";

import "./styles/App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/glance/*"
          element={
            <ProtectedRoute>
              <Glance />
            </ProtectedRoute>
          }
        />

        <Route path="/register" element={<RegistrationPage />} />
      </Routes>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
 */

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Glance from "./components/Glance";
import RegistrationPage from "./components/RegistrationPage";
import LandingPage from "./components/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";

import "./styles/App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* Protected Glance route with nested paths */}
          <Route
            path="/glance/*"
            element={
              <ProtectedRoute>
                <Glance />
              </ProtectedRoute>
            }
          />

          {/* Registration page */}
          <Route path="/register" element={<RegistrationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
