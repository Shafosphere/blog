import "./loginForm.css";
import React, { useState } from "react";
import axios from "axios";

export default function LoginForm({onLogin}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event){
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/login", {
        username,
        password,
      });
      onLogin(response.data);
    } catch (error) {
      console.error("Błąd logowania", error);
    }
  };

  return (
    <div className="container-LoginForm">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}
