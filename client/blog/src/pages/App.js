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
        // Jeśli użytkownik jest zalogowany, pokaż główną treść
        <Main />
      ) : (
        // Jeśli nie jest zalogowany, pokaż formularz logowania
        <Logging onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;