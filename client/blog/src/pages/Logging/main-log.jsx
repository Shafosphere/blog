import "./main-log.css";
import LoginForm from "../../components/Logging/Login/LoginForm";
import { useState } from "react";
export default function Logging({ onLogin }) {
  const [display, setDisplay] = useState("login");
  return (
    <div className="container-logging">
      <div className="window-logg">
        {display === "login" && (
          <>
            <div className="top-logg">
              <LoginForm onLogin={onLogin} />
            </div>
            <div className="bot-logg">
              <button className="button" type="submit">
                register
              </button>
              <button className="button" type="submit">
                reset
              </button>
            </div>
          </>
        )}
        {display === "register" && (
          <>
            <div className="top-logg">
              <LoginForm onLogin={onLogin} />
            </div>
            <div className="bot-logg">
              <button className="button" type="submit">
                register
              </button>
              <button className="button" type="submit">
                reset
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
