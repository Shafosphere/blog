import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Home from "./Home/Home";
export default function Main() {
  const [display, setDisplay] = useState(false);
  function changeDisplay(){
    setDisplay(display ? false : true)
  }

  return (
    <div className="container-main">
        <Navbar changeDisplay={changeDisplay}/>
        <Home display={display}/>
    </div>
  );
}

