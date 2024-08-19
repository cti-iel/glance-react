import React, { useState } from "react";
import "../styles/App.css";

import submitIcon from "../media/submit.jpg";

const InputBox = ({ placeholder, onSubmit }) => {
  const [query, setQuery] = useState("");
  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (query.trim() && onSubmit) {
        onSubmit(query);
      }
      setQuery(""); // Clear the input field after submission
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (query.trim() && onSubmit) {
      onSubmit(query);
    }
    setQuery(""); // Clear the input field after submission
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={(e) => e.preventDefault()} className="search-bar">
        <textarea
          className="search-input"
          placeholder={placeholder}
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
  );
};

export default InputBox;
