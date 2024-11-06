import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./App";
import { UserProvider } from "./components/UserContext"; // Import the UserProvider

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>,

  document.getElementById("root")
);
