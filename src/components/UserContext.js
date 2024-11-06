import React, { createContext, useState } from "react";

// Create the context
export const UserContext = createContext();

// Create the provider component
export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState("");
  const [projectID, setProjectID] = useState("");
  const [projectName, setProjectName] = useState("");

  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        projectID,
        setProjectID,
        projectName,
        setProjectName,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
