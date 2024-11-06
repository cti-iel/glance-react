// src/components/MediaGallery.js
import React, { useState } from "react";
import "../styles/App.css";
import { media } from "../media";
import { FaDownload, FaVideo, FaImage } from "react-icons/fa";

const MediaGallery_demo = () => {
  const [galleryType, setGalleryType] = useState("videos"); // or "images"

  return (
    <div>
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

export default MediaGallery_demo;
