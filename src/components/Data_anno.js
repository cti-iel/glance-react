import React, { useState, useRef, useEffect, useContext } from "react";
import { FaCamera, FaPlus, FaPlay } from "react-icons/fa";
import "@recogito/annotorious/dist/annotorious.min.css";
import { Annotorious } from "@recogito/annotorious";
import axios from "axios";
import Cookies from "js-cookie";
import { UserContext } from "./UserContext";

import "../styles/App.css";

const Data = () => {
  const [videoSrc, setVideoSrc] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [textTags, setTextTags] = useState([""]);
  const [thumbnails, setThumbnails] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]); // Store video files
  const [previewVideoName, setPreviewVideoName] = useState(""); // Add this state to store the video name
  const [videoID, setVideoID] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const annoRef = useRef(null);
  const fileInputRef = useRef(null);

  const { projectID, projectName } = useContext(UserContext);
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
    setTextTags([""]);
    setAnnotations([]);
    if (annoRef.current) {
      annoRef.current.clearAnnotations();
      annoRef.current.destroy();
      annoRef.current = null;
    }
  };

  const handleLocalUpload = () => {
    resetState();
    const inputElement = fileInputRef.current;
    if (inputElement) {
      inputElement.click();
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);

      event.target.value = null; // Clear the input

      // Generate a thumbnail for the video
      const videoElement = document.createElement("video");
      videoElement.src = url;
      videoElement.crossOrigin = "anonymous";

      videoElement.onloadedmetadata = () => {
        videoElement.currentTime = 0.1; // Seek to the first frame
      };

      videoElement.onseeked = () => {
        generateThumbnail(videoElement, file, url);
      };

      videoElement.onerror = () => {
        console.error("Error loading video.");
      };
    } else {
      console.error("No file selected or selected file is not a video.");
    }
  };

  const generateThumbnail = async (videoElement, file, url) => {
    // Upload the video
    try {
      const videoID = await handleVideoUpload(file);
      console.log("Uploaded video ID:", videoID);
      // You can now use the videoID in your logic

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Set the canvas dimensions to the video dimensions
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      // Draw the first frame of the video on the canvas
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // Convert the canvas to a data URL and save as a thumbnail
      const thumbnailDataUrl = canvas.toDataURL("image/png");
      setThumbnails((prevThumbnails) => [
        ...prevThumbnails,
        { thumbnail: thumbnailDataUrl, fileName: file.name },
      ]);
      setVideoFiles((prevFiles) => [...prevFiles, { file, url, videoID }]);
    } catch (error) {
      console.error("Error during video upload:", error);
    }
  };

  const handlePreviewClick = (index) => {
    const selectedVideo = videoFiles[index];
    setVideoSrc(selectedVideo.url);
    setPreviewVideoName(selectedVideo.file.name);
    setVideoID(selectedVideo.videoID);
  };

  const handleVideoUpload = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Video = reader.result.split(",")[1]; // Get base64 part
        const videoData = {
          name: file.name,
          created_at: new Date().toISOString(),
          video: base64Video,
          project_id: projectID,
          project_name: projectName,
        };

        const token = Cookies.get("authToken");

        try {
          const response = await axios.post(
            "http://localhost:18005/media/upload_video/",
            videoData,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Include the token in the request headers
                "Content-Type": "application/json",
              },
            }
          );
          console.log("Video ID is:", response.data["id"]);
          resolve(response.data["id"]);
        } catch (error) {
          console.error("Upload error:", error);
          reject(error);
        }
      };
      reader.onerror = (error) => {
        console.error("Error reading video file:", error);
        reject(error);
      };
    });
  };

  const handleSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const currentFrameTime = videoRef.current.currentTime;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL("image/png");

      console.log(`Elapsed time since video frame is:`, currentFrameTime);
      setSnapshot(dataURL);

      // Re-initialize Annotorious with the new snapshot
      if (annoRef.current) {
        annoRef.current.clearAnnotations();
        annoRef.current.destroy();
        annoRef.current = null;
      }

      setTimeout(() => {
        annoRef.current = new Annotorious({
          image: imgRef.current,
          widgets: ["TAG"],
        });

        let count = 0;
        annoRef.current.on("createAnnotation", (annotation) => {
          // console.log(`Annotation-${count} created:`, annotation);

          count += 1;

          annoRef.current.selectAnnotation(annotation);
          const { snippet } = annoRef.current.getSelectedImageSnippet();

          const dataURL = snippet.toDataURL();
          setAnnotations((prevAnnotations) => [
            ...prevAnnotations,
            {
              id: annotation.id,
              label: annotation.body[0]?.value || "",
              subImage: dataURL,
              currentFrameTime: currentFrameTime,
            },
          ]);
        });

        annoRef.current.on("deleteAnnotation", (annotation) => {
          console.log("Annotation deleted:", annotation);
          setAnnotations((prevAnnotations) =>
            prevAnnotations.filter((ann) => ann.id !== annotation.id)
          );
        });
      }, 0);
    } else {
      console.error("Video or canvas is not available for capturing snapshot.");
    }
  };

  const addTagInput = () => {
    setTextTags([...textTags, ""]);
  };

  const handleTagChange = (index, value) => {
    const newTextTags = [...textTags];
    newTextTags[index] = value;
    setTextTags(newTextTags);
  };

  // Every time the user clicks the "Get Insights" button, the tags and annotations are sent to the backend and insights are generated
  // If in the UI we upload a video and do the annotations, and upload another video without ckicking the "Get Insights" button, the annotations will be lost
  // To fix this, we can store the annotations in the local storage and retrieve them when the user uploads a video - right now the annotations are stored in the state. The UI
  // allows us to upload and annotate multiple videos but that is kid of useless since the annotations are lost when we upload a new video. In future we can
  // store the annotations in the local storage and retrieve them when the user uploads a video. That way we can handle the case when user annotates one video
  // and also wants insights from a second video (from the same factory for example)

  const handleGetInsights = async () => {
    const token = Cookies.get("authToken");
    const tag_data = {
      video_name: previewVideoName,
      video_id: videoID,
      textTags: textTags.filter((textTag) => textTag.trim() !== ""), // Filter out empty tags
      annotations: annotations.map((annotation) => ({
        label: annotation.label,
        subImage: annotation.subImage,
        current_frame_time: annotation.currentFrameTime,
      })),
    };

    try {
      const response = await axios.post(
        "http://localhost:18005/media/upload_tags/",
        tag_data,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Upload tags response received:", response.data);

      const insights_data = {
        project_name: projectName,
        project_id: projectID,
      };

      const insights = await axios.post(
        "http://localhost:18005/media/get_insights/",
        insights_data,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Insights received:", insights.data);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="upload-container">
      <input
        type="file"
        accept="video/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <div className="upload-canvas-container">
        <p>Add one or multiple videos</p>

        <div className="data-studio-container">
          <div className="thumbnail-container">
            {thumbnails.map((thumbnailObj, index) => (
              <div
                key={index}
                style={{
                  textAlign: "center",
                  margin: "10px",
                  position: "relative",
                }}
              >
                <div>
                  <img
                    key={index}
                    src={thumbnailObj.thumbnail}
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => handlePreviewClick(index)}
                    style={{
                      cursor: "pointer",
                      margin: "10px",
                      width: "100px",
                      height: "100px",
                    }}
                  />
                  <FaPlay
                    size={20}
                    color="white"
                    style={{
                      position: "absolute",
                      top: "40%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      pointerEvents: "none", // Ensure the icon doesn't interfere with the click event
                    }}
                  />
                </div>
                <p style={{ fontSize: "12px", marginTop: "5px" }}>
                  {thumbnailObj.fileName}
                </p>
              </div>
            ))}
          </div>
          <div className="card-container">
            <button onClick={handleLocalUpload} className="small-card">
              Local Upload
            </button>
            <button onClick={handleLocalUpload} className="small-card">
              Database
            </button>
          </div>
        </div>
      </div>

      {videoFiles && (
        <div className="video-annotation-div">
          <p>
            Click on a video from the Data Studio for Preview. Then click on the
            Snapshot button on the top right to capture an image.
          </p>
          {videoSrc && (
            <div className="video-controls">
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
                <p>
                  Draw a bounding box to select a section of the image. Enter a
                  descriptive tag. Repeat as necessary
                </p>
                <div className="input-section-div">
                  <div className="tag-container">
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
                          <img
                            src={annotation.subImage}
                            className="sub-image"
                          />
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
                    {textTags.map((textTag, index) => (
                      <div key={index} className="tag-input-container">
                        <input
                          type="text"
                          value={textTag}
                          onChange={(e) =>
                            handleTagChange(index, e.target.value)
                          }
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
      )}
    </div>
  );
};

export default Data;
