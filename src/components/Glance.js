import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import "../styles/App.css";

import Data from "./Data";
import Configure from "./Configure";
import Insights from "./Insights";
import Dashboard from "./Dashboard";
import Documentation from "./Documentation";
import UseCases from "./UseCases";

// Import Images
import glanceLogo from "../media/glance-logo-4.png"; // Adjust the path as necessary
import homeIcon from "../media/home.png";
import configIcon from "../media/config.png";
import historyIcon from "../media/history.png";

function Glance() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const { projectName } = useContext(UserContext);

  useEffect(() => {
    setActiveLink(location.pathname); // Update activeLink whenever location changes
  }, [location.pathname]);

  const navigate = useNavigate();

  const handleClickGlanceButton = () => {
    navigate("/glance/dashboard");
  };

  // Determine if the top-nav should be hidden
  const shouldHideTopNav =
    location.pathname === "/glance/configure" ||
    location.pathname === "/glance/library" ||
    location.pathname === "/glance/dashboard" ||
    location.pathname === "/glance/documentation" ||
    location.pathname === "/glance/usecases";

  return (
    <div className="main-container">
      <div className="side_panel">
        <button className="side-panel-logo" onClick={handleClickGlanceButton}>
          <img src={glanceLogo} alt="Local Upload" className="logo-image" />
        </button>

        <div className="side-panel-button">
          <Link to="/glance" onClick={() => setActiveLink("/glance")}>
            <img src={homeIcon} alt="Home" />
            <span>Home</span>
          </Link>
        </div>

        <div className="side-panel-button">
          <div className="history-container">
            <div className="configure-div">
              <img src={configIcon} alt="Query History" />
              <span>Configure</span>
            </div>

            <Link to="/glance/configure" className="history-description">
              Query Parameters
            </Link>
            <Link to="/glance/configure" className="history-description">
              Database Parameters
            </Link>
            <Link
              to="/glance/documentation"
              onClick={() => setActiveLink("/glance/documentation")}
            >
              <img src={historyIcon} alt="Context History" />
              <span>Documentation</span>
            </Link>
          </div>
        </div>
        <div className="side-panel-button">
          <Link
            to="/glance/usecases"
            onClick={() => setActiveLink("/glance/usecases")}
          >
            <img src={historyIcon} alt="Use Cases" />
            <span>Use Cases</span>
          </Link>
        </div>

        <div className="logout-button">
          <div>
            <p> Project {projectName}</p>
          </div>
          <Link to="/logout">
            <img src={configIcon} alt="Logout" />
            <span>Logout</span>
          </Link>
        </div>
      </div>

      <div className="content-container">
        {!shouldHideTopNav && (
          <nav className="top-nav">
            <Link
              to="/glance"
              className={activeLink === "/glance" ? "active" : ""}
              onClick={() => setActiveLink("/glance")}
            >
              Data Studio
            </Link>

            <Link
              to="/glance/context"
              className={activeLink === "/glance/context" ? "active" : ""}
              onClick={() => setActiveLink("/glance/context")}
            >
              Context Studio
            </Link>

            <Link
              to="/glance/insights"
              className={activeLink === "/glance/insights" ? "active" : ""}
              onClick={() => setActiveLink("/glance/insights")}
            >
              Insights
            </Link>
          </nav>
        )}

        <div
          style={{
            display: activeLink === "/glance/dashboard" ? "block" : "none",
          }}
        >
          <Dashboard />
        </div>
        <div style={{ display: activeLink === "/glance" ? "block" : "none" }}>
          <Data />
        </div>
        <div
          style={{
            display: activeLink === "/glance/usecases" ? "block" : "none",
          }}
        >
          <UseCases />
        </div>
        <div
          style={{
            display: activeLink === "/glance/documentation" ? "block" : "none",
          }}
        >
          <Documentation />
        </div>
        <div
          style={{
            display: activeLink === "/glance/configure" ? "block" : "none",
          }}
        >
          <Configure />
        </div>
        <div
          style={{
            display: activeLink === "/glance/insights" ? "block" : "none",
          }}
        >
          <Insights />
        </div>
      </div>
    </div>
  );
}

export default Glance;
