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
import "../styles/App.css";
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

const ContextStudio = ({ filters }) => {
  const [maxOutPutFrames, setMaxOutPutFrames] = useState(5);
  const [maxFrameSeparation, setMaxFrameSeparation] = useState(100);
  const [probThreshold, setProbThreshold] = useState(0.5);

  const data = generateData(filters);

  return (
    <div className="insights-container">
      <div className="content-area">
        <div className="input-section">
          <div className="input-section-div">
            <div className="dropdown-container">
              <label htmlFor="factory-name">Chose Query:</label>
              <select id="factory-name">
                <option value="factory1">Text Tag: Worker</option>
                <option value="factory2">Image Tag: Andon Light</option>
                <option value="factory3">Image Tag: Work Area</option>
              </select>
            </div>
          </div>
        </div>

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
                  onChange={(e) => setMaxOutPutFrames(Number(e.target.value))}
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
      </div>
    </div>
  );
};

export default ContextStudio;
