import "./main-log.css"
import LoginForm from '../../components/Logging/Login/LoginForm';
export default function Logging({onLogin}) {
  return (
    <div className="container-logging">
      <LoginForm onLogin={onLogin}/>
    </div>
  );
}

