import React, { useState, useRef, useEffect } from "react";
import { FaFolder, FaDatabase, FaCamera, FaPlus } from "react-icons/fa";
import "@recogito/annotorious/dist/annotorious.min.css";
import { Annotorious } from "@recogito/annotorious";

import "../styles/App.css";

const Data = () => {
  const [videoSrc, setVideoSrc] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [tags, setTags] = useState([""]);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const annoRef = useRef(null);

  useEffect(() => {
    if (snapshot && !annoRef.current) {
      annoRef.current = new Annotorious({
        image: imgRef.current,
        widgets: ["TAG"],
      });
      console.log("New Annotorious instance created:", annoRef.current);

      let count = 0;
      annoRef.current.on("createAnnotation", (annotation) => {
        console.log(`Annotation-${count} created:`, annotation);

        count += 1;

        annoRef.current.selectAnnotation(annotation);
        const { snippet } = annoRef.current.getSelectedImageSnippet();

        const dataURL = snippet.toDataURL();
        setAnnotations((prevAnnotations) => [
          ...prevAnnotations,
          {
            id: annotation.id,
            label: annotation.body[0]?.value || "",
            description: annotation.body[1]?.value || "",
            subImage: dataURL,
          },
        ]);
      });

      annoRef.current.on("deleteAnnotation", (annotation) => {
        console.log("Annotation deleted:", annotation);
        setAnnotations((prevAnnotations) =>
          prevAnnotations.filter((ann) => ann.id !== annotation.id)
        );
      });

      return () => {
        if (annoRef.current) {
          annoRef.current.destroy();
        }
      };
    }
  }, [snapshot]);

  const resetState = () => {
    setVideoSrc(null);
    setSnapshot(null);
    setAnnotations([]);
    if (annoRef.current) {
      annoRef.current.clearAnnotations();
      annoRef.current.destroy();
      annoRef.current = null;
    }
  };

  const triggerLocalUpload = () => {
    resetState();
    document.getElementById("video-upload").click();
  };

  const triggerDatabaseUpload = () => {
    resetState();
    document.getElementById("database-url").classList.toggle("hidden");
  };

  const connectToCamera = () => {
    resetState();
    alert("Connecting to streaming camera...");
    // Implement camera connection logic here
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      if (file.type.startsWith("video/")) {
        const url = URL.createObjectURL(file);

        // Clear the video input to ensure the same file can be uploaded again
        event.target.value = null;

        setVideoSrc(url);
        console.log("Video URL:", url);
      } else {
        console.error("Selected file is not a video.");
      }
    } else {
      console.error("No file selected.");
    }
  };

  const handleSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL("image/png");
      setSnapshot(dataURL);
      console.log("Snapshot captured:", dataURL);
    } else {
      console.error("Video or canvas is not available for capturing snapshot.");
    }
  };

  const addTagInput = () => {
    setTags([...tags, ""]);
  };

  const handleTagChange = (index, value) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const handleGetInsights = async () => {
    const data = {
      tags: tags.filter((tag) => tag.trim() !== ""), // Filter out empty tags
      annotations: annotations.map((annotation) => ({
        label: annotation.label,
        subImage: annotation.subImage,
      })),
    };

    try {
      const response = await fetch("http://localhost:8000/your-endpoint", {
        // Adjust this URL to your FastAPI endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Insights received:", result);
        // Handle the response, e.g., display insights or update the UI
      } else {
        console.error("Failed to get insights:", response.statusText);
      }
    } catch (error) {
      console.error("Error occurred while getting insights:", error);
    }
  };

  return (
    <div className="upload-container">
      <h1>Connect to your Video Source</h1>

      <div className="input-section">
        <div className="input-section-div">
          <div className="dropdown-container">
            <label htmlFor="factory-name">Factory Name:</label>
            <select id="factory-name">
              <option value="factory1">Greenfield</option>
              <option value="factory2">Berea</option>
              <option value="factory3">Harrodsburg</option>
            </select>

            <label htmlFor="camera-id">Camera ID:</label>
            <select id="camera-id">
              <option value="camera1">SMT-14</option>
              <option value="camera2">Motor Line</option>
              <option value="camera3">Invertor Line</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card-container">
        <div className="small-card" id="local-card">
          <FaFolder size={50} />
          <p>Local File</p>
          <input
            type="file"
            id="video-upload"
            accept="video/*"
            className="hidden"
            onChange={handleVideoUpload}
          />
          <button onClick={triggerLocalUpload}>Upload</button>
        </div>
        <div className="small-card" id="database-card">
          <FaDatabase size={50} />
          <p>Database</p>
          <input
            type="text"
            id="database-url"
            placeholder="Enter Database URL"
            className="hidden"
          />
          <button onClick={triggerDatabaseUpload}>Connect</button>
        </div>
        <div className="small-card" id="camera-card">
          <FaCamera size={50} />
          <p>Camera</p>
          <button onClick={connectToCamera}>Connect</button>
        </div>
      </div>
      {videoSrc && (
        <div className="video-controls">
          <h2>Preview</h2>
          <div className="video-container">
            <video ref={videoRef} src={videoSrc} controls width="600" />
            <div className="capture-button">
              <button onClick={handleSnapshot}>
                <FaCamera size={10} />
                <span className="tooltip-text">Capture Screenshot</span>
              </button>
            </div>
          </div>

          <div className="input-section">
            <div className="input-section-div">
              <div className="tag-container">
                <label htmlFor="tag">Describe the video with Annotations</label>
                <ol>
                  <li>Use Snapshot button to capture image</li>
                  <li>Draw Bounding box with cursor and enter tag</li>
                  <li>Repeat steps if necessary</li>
                </ol>
                <canvas ref={canvasRef} style={{ display: "none" }} />
                {snapshot && (
                  <div>
                    <div className="image-container">
                      <img
                        src={snapshot}
                        alt="Snapshot of video frame"
                        className="snapshot-image"
                        ref={imgRef}
                      />
                    </div>
                  </div>
                )}
                <div className="annotation-display">
                  {annotations.map((annotation, index) => (
                    <div key={index} className="saved-item">
                      <p>Label: {annotation.label}</p>

                      <img src={annotation.subImage} className="sub-image" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="input-section">
            <div className="input-section-div">
              <div className="tag-container">
                <label htmlFor="tag">Describe the video with Words</label>
                {tags.map((tag, index) => (
                  <div key={index} className="tag-input-container">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      placeholder="Word or Short Phrase"
                      className="tag-input"
                    />
                  </div>
                ))}
                <button onClick={addTagInput} className="add-tag-button">
                  <FaPlus />
                </button>
              </div>
            </div>
          </div>
          <button className="insights-button" onClick={handleGetInsights}>
            Get Insights
          </button>
        </div>
      )}
    </div>
  );
};

export default Data;
