import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Glance from "./components/Glance";
import RegistrationPage from "./components/RegistrationPage";
import LandingPage from "./components/LandingPage";

import "./styles/App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/glance/*" element={<Glance />} />
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
