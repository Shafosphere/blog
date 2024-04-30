import "./main-log.css";
import LoginForm from "../../components/Logging/Login/LoginForm";
import RegiForm from "../../components/Logging/Registration/regiForm";
import { useState } from "react";
export default function Logging({ setIsAuthenticated, checkAuthentication }) {
  const [display, setDisplay] = useState("login");
  return (
    <div className="container-logging">
      <div className="window-logg">
        {display === "login" && (
          <>
            <div className="top-logg">
              <LoginForm setIsAuthenticated={setIsAuthenticated}checkAuthentication={checkAuthentication}/>
            </div>
            <div className="bot-logg">
              <button onClick={()=>setDisplay("register")} className="button" type="submit">
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
              <RegiForm setDisplay={setDisplay}/>
            </div>
            <div className="bot-logg">
              <button onClick={()=>setDisplay("login")} className="button" type="submit">
                log in
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
