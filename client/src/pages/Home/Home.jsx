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
      setArticles(response.data);
    }
    getArticles();
  }, []);

  function dateFormat(creationTime) {
    const date = new Date(creationTime);
    const readableDate = date.toLocaleString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return readableDate;
  };

  function bigCard(){
    const mainArticle = articles.find((article) => article.isMain);
    return (
      <BigCard mainArticle={mainArticle}/>
    )
  }

  function smallCard(){
    const smallArticles = articles.filter((article) => !article.isMain);
    console.log('smallArticles: ' + smallArticles);
    return (
      <>
        {smallArticles.map((item)=>{
          return <SmallCard key={item.id} smallArticles={item} dateFormat={dateFormat} />;
        })}
      </>
    )
  }

  function WindowHome() {
    return (
      <div className="window-home">
        <div className="title-home">Cool Articles</div>
        <div className="content-home">
          {articles ? bigCard() : null}
          {articles ? smallCard() : null}
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
