import { useEffect, useRef, useState } from "react";
import "@recogito/annotorious/dist/annotorious.min.css";
import { Annotorious } from "@recogito/annotorious";
import "../styles/VideoExplore.css"; // Ensure you create and link this CSS file

import plusIcon from "../media/plus.jpg";
import submitIcon from "../media/submit.jpg";

const VideoExplore = () => {
  const [videoSrc, setVideoSrc] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [snapshot, setSnapshot] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [query, setQuery] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const annoRef = useRef(null);

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setQuery(e.target.value);
      console.log("Input submitted:", e.target.value);
    }
  };

  useEffect(() => {
    if (snapshot && !annoRef.current) {
      annoRef.current = new Annotorious({
        image: imgRef.current,
        widgets: ["TAG"],
      });
      console.log("New Annotorious instance created:", annoRef.current);

      var count = 0;
      annoRef.current.on("createAnnotation", (annotation) => {
        console.log(`Annotation-${count} created:`, annotation);

        count = count + 1;

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

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      if (file.type.startsWith("video/")) {
        const url = URL.createObjectURL(file);
        setVideoSrc(url);
        setErrorMessage("");
        console.log("Video URL:", url);
      } else {
        console.error("Selected file is not a video.");
        setErrorMessage("Please select a valid video file.");
      }
    } else {
      console.error("No file selected.");
      setErrorMessage("No file selected.");
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
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="video-explore-container">
      <div className="search-bar-container">
        <form onSubmit={(e) => e.preventDefault()} className="search-bar">
          <div className="search-button-container">
            <button type="submit" className="search-button">
              <img src={plusIcon} alt="Plus" />
              <div className="tooltip">Upload an image to search</div>
            </button>
            <span className="search-button-text">Attach</span>
          </div>
          <input
            type="text"
            id="search-input"
            placeholder="Enter your query or attach image"
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleInputKeyPress}
          />

          <div className="search-button-container">
            <button
              type="submit"
              className="search-button"
              onClick={handleSubmit}
              disabled={!query.trim()}
            >
              <img src={submitIcon} alt="submit" />
            </button>
            <span className="search-button-text">Submit</span>
          </div>
        </form>
      </div>

      <input type="file" accept="video/*" onChange={handleVideoUpload} />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {videoSrc && (
        <div className="video-controls">
          <video ref={videoRef} src={videoSrc} controls width="600" />
          <div className="buttons">
            <button onClick={handleSnapshot}>Take Snapshot</button>
          </div>
          <canvas ref={canvasRef} style={{ display: "none" }} />
          {snapshot && (
            <div>
              <h3>Snapshot</h3>
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
        </div>
      )}
      <div>
        <h3>Saved Annotations</h3>
        {annotations.map((annotation, index) => (
          <div key={index} className="saved-item">
            <p>Label: {annotation.label}</p>
            <p>Description: {annotation.description}</p>
            <img src={annotation.subImage} className="sub-image" />
            <a
              href={annotation.subImage}
              download={`annotation-${index + 1}.png`}
              className="download-button"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoExplore;
