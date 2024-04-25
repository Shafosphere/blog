import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Main from "./main";
import "./index.css";
import Logging from "./Logging/main-log";
import ErrorPage from '../error-page';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
    // Only check if not already authenticated
    if (!isAuthenticated) { 
        try {
            const response = await axios.get('http://localhost:8080/is-authenticated');
            const { authenticated, user } = response.data;
            setIsAuthenticated(authenticated);
            setUser(response.data.user);
        } catch (error) {
            console.error('Authentication check error:', error);
        }
    }
    };

    checkAuthentication();
}, []);

  return (
    <Routes>
      <Route path='/' element={<Logging/>}/> 
      <Route path='/login' element={<Logging/>}/> 

      {/* Protected Route */}
      <Route 
        path='/main' 
        element={isAuthenticated ? <Main/> : <Navigate to="/login" replace />}
      /> 

      <Route path='*' element={<ErrorPage/>}/>
    </Routes>
  );
}

export default App;