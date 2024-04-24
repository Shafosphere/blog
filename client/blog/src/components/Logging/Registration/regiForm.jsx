import "./regiForm.css";
import React, { useState } from "react";
import axios from "axios";

export default function RegiForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirm] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (!passwordsMatch()) {
      alert("Password does not match");
      return;
    }
    try {
      await axios.post("http://localhost:8080/register", {
        username,
        email,
        password,
        confirmPass,
      });
      onLogin(username);
    } catch (error) {
      console.error("Loggin error", error);
    }
  }

  function passwordsMatch() {
    return password === confirmPass;
  }

  return (
    <div className="container-LoginForm">
      <form onSubmit={handleSubmit}>
      <div className="title-logg">Create an account</div>
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
              type="email"
              value={email}
              autoComplete="username"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
              required
            />
          </div>
          <div className="custom_input">
            <input
              className="input"
              type="password"
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              required
            />
          </div>
          <div className="custom_input">
            <input
              className="input"
              type="password"
              value={confirmPass}
              autoComplete="new-password"
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="confirm the password"
              required
            />
          </div>
        </div>
        <button className="button" type="submit">
          sign up
        </button>
      </form>
    </div>
  );
}
