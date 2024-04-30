import "./loginForm.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function LoginForm({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/login", {
        username,
        password,
      }, {
        withCredentials: true
      });
      if (response.data.success) {
        setIsAuthenticated(true);
        navigate("/main");
      } else {
        console.log("not user like this");
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="container-LoginForm">
      <form onSubmit={handleSubmit}>
        <div className="title-logg">Logging in</div>
        <div className="container-input">
          <div className="custom_input">
            <input
              className="input"
              name="username"
              type="text"
              value={username}
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              required
            />
          </div>
          <div className="custom_input">
            <input
              className="input"
              name="password"
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              required
            />
          </div>
        </div>
        <button className="button" type="submit">
          Log in
        </button>
      </form>
    </div>
  );
}
