import React, { useState } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import "../styles/Context.css"; // Custom CSS file for styling

const ContextLibrary = () => {
  const rows = [
    {
      factory: "Astemo HK",
      line: "SMT-14",
      cameraID: "IEL-001",
      provider: "Koichi Yamaka",
      timestamp: "2024-08-15 | 14:20:13",
      description:
        "This video shows the procedure of dealing with a mechanical issue in the SMT machine. When the red light flashes the operator should come and check the machine.",
      videoUrl:
        "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      detailsText: "This is some detailed information about the operation.",
      gallery: [
        { label: "Image 1", src: "https://via.placeholder.com/150" },
        { label: "Image 2", src: "https://via.placeholder.com/150" },
        { label: "Image 3", src: "https://via.placeholder.com/150" },
      ],
    },
    {
      factory: "Astemo HK",
      line: "SMT-14",
      cameraID: "IEL-001",
      provider: "Koichi Yamaka",
      timestamp: "2024-08-15 | 15:00:00",
      description: "This is a shorter description.",
      videoUrl:
        "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      detailsText: "This is some shorter detailed information.",
      gallery: [
        { label: "Image A", src: "https://via.placeholder.com/150" },
        { label: "Image B", src: "https://via.placeholder.com/150" },
      ],
    },
  ];

  const [expandedRow, setExpandedRow] = useState(null);

  const handleViewClick = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <div className="table-responsive">
      <table className="table table-dark table-hover">
        <thead>
          <tr>
            <th>Factory</th>
            <th>Line</th>
            <th>Camera ID</th>
            <th>Context Provider</th>
            <th>TimeStamp</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <React.Fragment key={index}>
              <tr>
                <td>{row.factory}</td>
                <td>{row.line}</td>
                <td>{row.cameraID}</td>
                <td>{row.provider}</td>
                <td>{row.timestamp}</td>
                <td
                  className={
                    expandedRow === index
                      ? "full-description"
                      : "description-cell"
                  }
                  onClick={() => handleViewClick(index)}
                >
                  {row.description}
                </td>
                <td>
                  <div className="btn-container">
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleViewClick(index)}
                      title="View more details"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="btn btn-secondary"
                      title="Delete this row"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
              {expandedRow === index && (
                <tr>
                  <td colSpan="7">
                    <div
                      className="collapse-link"
                      onClick={() => handleViewClick(index)}
                    >
                      Collapse
                    </div>
                    <div className="expanded-content">
                      <div className="video-container">
                        <video controls width="100%">
                          <source src={row.videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                      <div className="text-container">
                        <p>{row.detailsText}</p>
                      </div>
                      <div className="gallery-container">
                        {row.gallery.map((image, imgIndex) => (
                          <div key={imgIndex} className="gallery-item">
                            <img src={image.src} alt={image.label} />
                            <p>{image.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContextLibrary;
