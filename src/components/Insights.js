/* import React, { useState } from "react";
import InputBox from "./InputBox";
import "../styles/App.css";
import MediaGallery_demo from "./MediaGallery_demo";

const Insights = () => {
  const [submittedText, setSubmittedText] = useState("");

  const handleQuerySubmit = (query) => {
    setTimeout(() => {
      setSubmittedText(query); // Set the query text after a 2-second delay
    }, 2000); // 2000 ms = 2 seconds
  };

  return (
    <div className="insights-container">
      <div className="content-area">
        <InputBox placeholder={"Ask a Question"} onSubmit={handleQuerySubmit} />
      </div>

      {submittedText && (
        <div>
          <div className="submitted-text">
            <p>
              Based on the recorded footage from the SMT line, we found 2
              failures today. Staff detected these failures in 2 and 11 minutes
              respetively and promptly fixed them. You can see the footage here
            </p>
          </div>
          <MediaGallery_demo />{" "}
        </div>
      )}
    </div>
  );
};

export default Insights;
 */

import React, { useState } from "react";
import InputBox from "./InputBox";
import "../styles/App.css";
import MediaGallery_demo from "./MediaGallery_demo";

const Insights = () => {
  const [submittedText, setSubmittedText] = useState("");

  const handleQuerySubmit = (query) => {
    setTimeout(() => {
      setSubmittedText(query); // Set the query text after a 2-second delay
    }, 2000); // 2000 ms = 2 seconds
  };

  return (
    <div className="insights-container">
      <div className="content-area">
        <InputBox
          placeholder={"Ask a Question"}
          onSubmit={handleQuerySubmit}
          value={submittedText} // Pass the submittedText back to the InputBox
        />
      </div>

      {submittedText && (
        <div>
          <div className="submitted-text">
            <p>
              Based on the recorded footage from the SMT line, we found 2
              failures today. Staff detected these failures in 2 and 11 minutes
              respectively and promptly fixed them. You can see the footage here
            </p>
          </div>
          <MediaGallery_demo />
        </div>
      )}
    </div>
  );
};

export default Insights;
