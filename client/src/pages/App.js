import React, { useState, useEffect } from "react";
import axios from "axios";
import Main from "./main";
import Article from "./Article/Article";
import "./index.css";
import Logging from "./Logging/main-log";
import { Routes, Route, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("sprawdzam");
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/is-authenticated",
          { withCredentials: true }
        );
        setIsAuthenticated(response.data.authenticated);
        if (setIsAuthenticated) {
          navigate("/main");
        }
        console.log("??? + " + response.data.authenticated);
      } catch (error) {
        console.error("Authentication check error:", error);
      }
    };

    checkAuthentication();
  }, []);

  return (
    <Routes>
      {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
      <Route
        path="/login"
        element={<Logging setIsAuthenticated={setIsAuthenticated} />}
      />

      {/* Protected Route */}
        <Route
          path="/main"
          element={isAuthenticated ? <Main /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/article/:id"
          element={isAuthenticated ? <Article /> : <Navigate to="/login" replace />}
        />
    </Routes>
  );
}

export default App;
