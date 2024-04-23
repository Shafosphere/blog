import React, { useState } from 'react';
import Main from "./main";
import Logging from "./Logging/main-log";

function App() {
  const [user, setUser] = useState(null);
  const handleLogin = (userData) => {
    setUser(userData);
  };
  return (
    <div className="App">
      {user ? (
        <Main username={user}/>
      ) : (
        <Logging onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;