import "./Home.css";
import BigCard from "../../components/Home/bigCard/bigCard";
import SmallCard from "../../components/Home/smallCard/smallCard";
import AddPost from "../../components/Home/addPost/addPost";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home({ display }) {
  const [articles, setArticles] = useState()
  useEffect(() => {
    async function getArticles(){
      const response = await axios.get(
        "http://localhost:8080/data",
        { withCredentials: true }
      );
      setArticles(response)
    }
    getArticles();
  }, []);

  function WindowHome() {
    return (
      <div className="window-home">
        <div className="title-home">Cool Articles</div>
        <div className="content-home">
          <BigCard />
          <SmallCard />
          <SmallCard />
          <SmallCard />
          <SmallCard />
          <SmallCard />
          <SmallCard />
        </div>
      </div>
    );

  }

  return (
    <div className="container-home">
      {display ? <AddPost/> : <WindowHome/>}
    </div>
  );
}
