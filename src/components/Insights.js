import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "../styles/Explore.css";
import MediaGallery from "./MediaGallery";
import InputBox from "./InputBox";
import gaussian from "gaussian"; // Only for UI testing purposes. Not needed when connected to the backend.

const generateData = (filters) => {
  var distribution1 = gaussian(10, 1500);
  var distribution2 = gaussian(100, 1500);
  var distribution3 = gaussian(700, 1500);
  var distribution4 = gaussian(800, 1500);
  var distribution5 = gaussian(1000, 1500);
  var noise = gaussian(0, 0.000001);
  const data = Array.from({ length: 1500 }, (_, i) => ({
    index: i,
    value:
      1.5 * distribution1.pdf(i) +
      1.2 * distribution2.pdf(i) +
      distribution3.pdf(i) +
      distribution4.pdf(i) +
      1.8 * distribution5.pdf(i) +
      noise.ppf(Math.random()), // Replace with your actual data generation logic
  }));
  // Apply filters if necessary
  return data;
};

const CustomDot = ({ cx, cy, value, index }) => {
  const markerIndices = [100, 500, 1000]; // Example indices where markers should be placed
  if (markerIndices.includes(index)) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={5} fill="red" />
      </g>
    );
  }
  return null;
};

const Insights = ({ filters }) => {
  const [maxOutPutFrames, setMaxOutPutFrames] = useState(5);
  const [maxFrameSeparation, setMaxFrameSeparation] = useState(100);
  const [probThreshold, setProbThreshold] = useState(0.5);

  const [shouldRender, setShouldRender] = useState(false);
  const [message, setMessage] = useState("");
  const [placeholder, setPlaceholder] = useState("Type your query here...");
  const [progress, setProgress] = useState(0);

  const handleInputSubmit = (query) => {
    setShouldRender(false);
    setMessage(`You asked: ${query}`);
    setProgress(0); // Reset progress

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setShouldRender(true);
          setPlaceholder("Type a follow up query...");
          return prev;
        }
        return prev + 1;
      });
    }, 20); // Progress increments every 20ms for a 2-second duration
  };

  const data = generateData(filters);

  return (
    <div className="insights-container">
      <div className="content-area">
        {shouldRender && (
          <>
            <h2>{message}</h2>
            <h2 className="chart-title">Query Results</h2>
            <MediaGallery />
            <h2 className="chart-title">Search Configuration</h2>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="index" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    dot={<CustomDot />}
                  />
                </LineChart>
              </ResponsiveContainer>

              <form className="new-component">
                <div className="filter-div">
                  <label>
                    Max Output Frames
                    <input
                      type="number"
                      value={maxOutPutFrames}
                      onChange={(e) =>
                        setMaxOutPutFrames(Number(e.target.value))
                      }
                    />
                  </label>
                  <label>
                    Max Frame Separation
                    <input
                      type="number"
                      value={maxFrameSeparation}
                      onChange={(e) =>
                        setMaxFrameSeparation(Number(e.target.value))
                      }
                    />
                  </label>
                  <label>
                    Probability Threshold
                    <input
                      type="number"
                      value={probThreshold}
                      onChange={(e) => setProbThreshold(Number(e.target.value))}
                    />
                  </label>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
      <div className="input-box-wrapper">
        <InputBox placeholder={placeholder} onSubmit={handleInputSubmit} />
        {progress > 0 && progress < 100 && (
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;
