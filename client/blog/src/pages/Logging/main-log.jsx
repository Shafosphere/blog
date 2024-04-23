import "./main-log.css";
import LoginForm from "../../components/Logging/Login/LoginForm";
export default function Logging({ onLogin }) {
  return (
    <div className="container-logging">
      <div className="window-logg">
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
      </div>
    </div>
  );
}
