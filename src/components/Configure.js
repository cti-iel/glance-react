import React, { useState } from "react";
import "../styles/Configure.css"; // Ensure you create and link this CSS file

function Configure() {
  const [frameBatchSize, setFrameBatchSize] = useState(2000);
  const [clipBatchSize, setClipBatchSize] = useState(32);
  const [regressionChoice, setRegressionChoice] = useState("Gaussian");
  const [iterations, setIterations] = useState(8);
  const [batchSize, setBatchSize] = useState(64);
  const [motionDetection, setMotionDetection] = useState("Off");
  const [accuracySpeedTradeoff, setAccuracySpeedTradeoff] = useState(0.5);

  const handleFrameBatchSizeChange = (increment) => {
    setFrameBatchSize((prev) => Math.max(0, prev + increment));
  };

  const handleClipBatchSizeChange = (increment) => {
    setClipBatchSize((prev) => Math.max(0, prev + increment));
  };

  const handleIterationsChange = (increment) => {
    setIterations((prev) => Math.max(0, prev + increment));
  };

  const handleBatchSizeChange = (increment) => {
    setBatchSize((prev) => Math.max(0, prev + increment));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log({
      frameBatchSize,
      clipBatchSize,
      regressionChoice,
      iterations,
      batchSize,
      motionDetection,
      accuracySpeedTradeoff,
    });

    const data = {
      frameBatchSize: frameBatchSize,
      clipBatchSize: clipBatchSize,
      regressionChoice: regressionChoice,
      iterations: iterations,
      batchSize: batchSize,
      motionDetection: motionDetection,
      accuracySpeedTradeoff: accuracySpeedTradeoff,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/query-params", {
        // Adjust this URL to your FastAPI endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Insights received:", result);
      // Handle the response, e.g., display insights or update the UI
    } catch (error) {
      console.error("Error occurred while getting insights:", error);
    }
  };

  return (
    <form className="new-component" onSubmit={handleSubmit}>
      <h2>Configure Query Parameters</h2>
      <div className="slider-container">
        <label>Accuracy vs Speed Tradeoff</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={accuracySpeedTradeoff}
          onChange={(e) => setAccuracySpeedTradeoff(parseFloat(e.target.value))}
        />
        <div className="slider-values">
          <span>0.00</span>
          <span>{accuracySpeedTradeoff.toFixed(2)}</span>
          <span>1.00</span>
        </div>
      </div>

      <div className="parameters">
        <div className="parameter-group">
          <h3>Image Processing Parameters</h3>
          <label>
            Frame Batch Size for Regression Analysis
            <div className="input-group">
              <input type="number" value={frameBatchSize} readOnly />
              <button
                type="button"
                onClick={() => handleFrameBatchSizeChange(-1)}
              >
                -
              </button>
              <button
                type="button"
                onClick={() => handleFrameBatchSizeChange(1)}
              >
                +
              </button>
            </div>
          </label>
          <label>
            Frame batch size for CLIP Analysis
            <div className="input-group">
              <input type="number" value={clipBatchSize} readOnly />
              <button
                type="button"
                onClick={() => handleClipBatchSizeChange(-1)}
              >
                -
              </button>
              <button
                type="button"
                onClick={() => handleClipBatchSizeChange(1)}
              >
                +
              </button>
            </div>
          </label>
          <label>
            Preprocess with Motion Detection
            <select
              value={motionDetection}
              onChange={(e) => setMotionDetection(e.target.value)}
            >
              <option value="Off">Off</option>
              <option value="On">On</option>
            </select>
          </label>
        </div>

        <div className="parameter-group">
          <h3>Regression Parameters</h3>
          <label>
            Regression Choice
            <select
              value={regressionChoice}
              onChange={(e) => setRegressionChoice(e.target.value)}
            >
              <option value="Gaussian">Gaussian</option>
              <option value="Linear">Linear</option>
              <option value="Polynomial">Polynomial</option>
            </select>
          </label>
          <label>
            Number of Iterations
            <div className="input-group">
              <input type="number" value={iterations} readOnly />
              <button type="button" onClick={() => handleIterationsChange(-1)}>
                -
              </button>
              <button type="button" onClick={() => handleIterationsChange(1)}>
                +
              </button>
            </div>
          </label>
          <label>
            Batch Size
            <div className="input-group">
              <input type="number" value={batchSize} readOnly />
              <button type="button" onClick={() => handleBatchSizeChange(-1)}>
                -
              </button>
              <button type="button" onClick={() => handleBatchSizeChange(1)}>
                +
              </button>
            </div>
          </label>
        </div>
      </div>

      <button type="submit" className="submit-button">
        Execute Query
      </button>
    </form>
  );
}

export default Configure;
