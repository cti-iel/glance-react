// src/components/MediaGallery.js
import React, { useState } from "react";
import "../styles/App.css";
import { media } from "../media";
import { FaDownload, FaVideo, FaImage } from "react-icons/fa";

const MediaGallery = () => {
  const [galleryType, setGalleryType] = useState("videos"); // or "images"
  const [selectedOption, setSelectedOption] = useState("Similarity Based");

  const handleGallerySwitch = (type) => {
    setGalleryType(type);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <div className="gallery-switch">
        <button onClick={() => handleGallerySwitch("videos")}>
          <FaVideo />
        </button>
        <button onClick={() => handleGallerySwitch("images")}>
          <FaImage />
        </button>
      </div>

      <div className="radio-buttons">
        <label>
          <input
            type="radio"
            value="Similarity Based"
            checked={selectedOption === "Similarity Based"}
            onChange={handleOptionChange}
          />
          Similarity Based
        </label>
        <label>
          <input
            type="radio"
            value="Timestamp Based"
            checked={selectedOption === "Timestamp Based"}
            onChange={handleOptionChange}
          />
          Timestamp Based
        </label>
      </div>

      <div className="media-gallery">
        {media[galleryType].map((item) => (
          <div key={item.id} className="media-item">
            {item.type === "video" ? (
              <video controls width="320" height="240">
                <source src={item.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={item.src} alt={item.title} width="320" height="240" />
            )}
            <div className="media-title">
              {item.title}
              <a href={item.src} download className="download-button">
                <FaDownload />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaGallery;
