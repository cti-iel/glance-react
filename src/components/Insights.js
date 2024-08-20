import React from "react";
import InputBox from "./InputBox";
import "../styles/App.css";

const Insights = () => {
  return (
    <div className="insights-container">
      <div className="content-area">
        <InputBox placeholder={"Ask a Question"}></InputBox>
      </div>
    </div>
  );
};

export default Insights;
