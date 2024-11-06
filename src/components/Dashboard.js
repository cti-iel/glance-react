import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import "../styles/App.css";
import { FaPlus, FaPlay } from "react-icons/fa";
import testVideo from "../media/test_smt_video-h264-cropped.mp4";
import defaultImage from "../media/glance-logo-4.png"; // Adjust the path
import dashboardImage from "../media/glance-dashboard-image.png"; // Adjust the path
import pastPJImage from "../media/past-project.png"; // Adjust the path
import axios from "axios";
import Cookies from "js-cookie";

const Dashboard = () => {
  const { username, setProjectID, projectName, setProjectName } =
    useContext(UserContext);
  const location = useLocation();

  // Debugging: Check what is being passed in location.state
  useEffect(() => {
    console.log("Location state:", location.state);
  }, [location.state]);

  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const handleInputChange = (e) => {
    setProjectName(e.target.value);
  };

  const handleButtonClick = async () => {
    if (projectName.trim() !== "") {
      // Navigate to the upload page
      navigate("/glance/home");
      console.log("Button clicked! Creating a new project...");

      const now = new Date();
      const isoString = now.toISOString(); // Convert to ISO string

      const projectData = {
        name: projectName,
        created_at: isoString, // Send as ISO string
      };

      const token = Cookies.get("authToken");

      try {
        const response = await axios.post(
          "/api/media/upload_project/",
          projectData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the request headers
              "Content-Type": "application/json",
            },
          }
        );

        // console.log("Uploaded Project Name:", response.data["name"]);
        //console.log("Uploaded Project owner ID:", response.data["owner_id"]);
        //console.log("Uploaded Project ID:", response.data["id"]);
        setProjectID(response.data["id"]);
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Welcome {username || "Guest"}</h2>
      </header>

      <div className="dashboard-intro">
        <div className="intro-card video-container">
          {!isPlaying ? (
            <div className="video-placeholder" onClick={handlePlayClick}>
              <img
                src={defaultImage}
                alt="Default"
                className="video-thumbnail"
              />
              <FaPlay className="play-button" size={50} />
            </div>
          ) : (
            <video controls autoPlay>
              <source src={testVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        <div className="intro-card">
          <div className="top-container">
            <img src={dashboardImage} alt="Model 1" className="model-image" />
          </div>
          <div className="bottom-container">
            <h3>
              Glance analyzes hours of industrial video in minutes through AI
              and domain knowledge integration
            </h3>
          </div>
        </div>
      </div>

      <section className="dashboard-projects">
        <div className="projects-header">
          <h2>Projects</h2>
          <a href="/projects" className="view-all-link">
            View All
          </a>
        </div>

        <div className="projects-grid">
          <div className="project-card-new">
            <button
              className={`plus-button ${
                projectName.trim() === "" ? "disabled" : ""
              }`}
              onClick={handleButtonClick}
              disabled={projectName.trim() === ""}
            >
              <FaPlus
                size={50}
                color={projectName.trim() === "" ? "gray" : "blue"}
              />
            </button>

            <input
              type="text"
              className="project-name-input"
              placeholder="Enter new project name"
              value={projectName}
              onChange={handleInputChange}
            />
          </div>
          <div className="project-card">
            <div className="past-projects-img-container">
              <img src={pastPJImage} alt="Default" />
            </div>
            <div className="past-projects-info-container">
              <h3> Test Project 1</h3>
              <p>Created at: 8/26/2024 9:15 AM</p>
            </div>
          </div>
          <div className="project-card">
            <div className="past-projects-img-container">
              <img src={pastPJImage} alt="Default" />
            </div>
            <div className="past-projects-info-container">
              <h3> Test Project 2</h3>
              <p>Created at: 8/27/2024 10:54 PM</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
