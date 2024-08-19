import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import "../styles/App.css";
import Insights from "./Insights";
import Data from "./Data";
import Configure from "./Configure";
import VideoExplore from "./VideoExplore";
import Context from "./Context";

// Import Images
import glanceLogo from "../media/glance-logo.png"; // Adjust the path as necessary
import homeIcon from "../media/home.png";
import configIcon from "../media/config.png";
import historyIcon from "../media/history.png";

function Glance() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(
    location.pathname === "/" ? "/glance" : location.pathname
  );

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  // Determine if the top-nav should be hidden
  const shouldHideTopNav =
    location.pathname === "/glance/configure" ||
    location.pathname === "/glance/library";

  return (
    <div className="main-container">
      <div className="side_panel">
        <div className="side-panel-logo">
          <img src={glanceLogo} alt="Local Upload" width="100" />
        </div>
        <div className="side-panel-button">
          <Link to="/glance" onClick={() => handleLinkClick("/glance")}>
            <img src={homeIcon} alt="Home" />
            <span>Home</span>
          </Link>
        </div>
        <div className="side-panel-button">
          <Link
            to="/glance/configure"
            onClick={() => handleLinkClick("/glance/configure")}
          >
            <img src={configIcon} alt="Configure" />
            <span>Configure</span>
          </Link>
        </div>

        <div className="side-panel-button">
          <div className="history-container">
            <Link
              to="/glance/library"
              onClick={() => handleLinkClick("/glance/library")}
            >
              <img src={historyIcon} alt="Query History" />
              <span>History</span>
            </Link>
            <Link to="/glance/library" className="history-description">
              Find out the mean time to detect error in SMT line 14...
            </Link>
            <Link to="/glance/library" className="history-description">
              Find out the number of times the red light flashed yesterday...
            </Link>
          </div>
        </div>
        <div className="logout-button">
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
              onClick={() => handleLinkClick("/glance")}
            >
              Data Studio
            </Link>

            <Link
              to="/glance/insights"
              className={activeLink === "/glance/insights" ? "active" : ""}
              onClick={() => handleLinkClick("/glance/insights")}
            >
              Insights
            </Link>

            <Link
              to="/glance/context"
              className={activeLink === "/glance/context" ? "active" : ""}
              onClick={() => handleLinkClick("/glance/context")}
            >
              Context Studio
            </Link>
          </nav>
        )}

        {/* Render all components but only show the active one */}
        <div style={{ display: activeLink === "/glance" ? "block" : "none" }}>
          <Data />
        </div>
        <div
          style={{
            display: activeLink === "/glance/insights" ? "block" : "none",
          }}
        >
          <Insights />
        </div>
        <div
          style={{
            display: activeLink === "/glance/context" ? "block" : "none",
          }}
        >
          <Context />
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
            display: activeLink === "/glance/library" ? "block" : "none",
          }}
        >
          <VideoExplore />
        </div>
      </div>
    </div>
  );
}

export default Glance;
