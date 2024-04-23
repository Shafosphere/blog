import Navbar from "../components/Navbar/Navbar";
import Home from "./Home/Home";
export default function Main({username}) {
  return (
    <div className="container-main">
        <Navbar username={username}/>
        <Home/>
    </div>
  );
}

