import { useEffect, useState } from "react";
import "./Navbar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Navbar({changeDisplay}) {
  const [isLoggedIn, setLogged] = useState(false);
  const [nickname, setNickname] = useState();
  const navigate = useNavigate();


  useEffect(() => {
    console.log("sprawdzam");
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/is-authenticated",
          { withCredentials: true }
        );
        setLogged(response.data.authenticated);
        console.log("??? + " + response.data.authenticated);
        setNickname(response.data.user);
      } catch (error) {
        console.error("Authentication check error:", error);
      }
    };

    checkAuthentication();
  }, []);

  function logout() {
    axios.get('http://localhost:8080/logout', { withCredentials: true })
      .then(response => {
        if(response.data.success) {
          navigate("/login");
          console.log(response.data.message);
        }
      })
      .catch(error => {
        console.error('Error during logout:', error);
      });
  }

  return (
    <div className="container-navbar">
      <div className="window-navbar">
        <div className="left-navbar">
          <div className="title-navbar">blogg</div>
          <div className="nickname-navbar">
            {isLoggedIn ? <>Hello {nickname}</> : null}
          </div>
        </div>
        <div className="right-navbar">
        <div className="logout">
          <span onClick={()=>logout()} className="underline">Logout</span>
        </div>
        <div onClick={()=>changeDisplay()} className="add-navbar">+</div>
        </div>
      </div>
    </div>
  );
}
