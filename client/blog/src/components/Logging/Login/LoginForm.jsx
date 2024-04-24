import "./loginForm.css";
import React, { useState } from "react";
import axios from "axios";

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await axios.post("http://localhost:8080/login", {
        username,
        password,
      });
      onLogin(username);
    } catch (error) {
      console.error("Loggin error", error);
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
