import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Article.css";
import Navbar from "../../components/Navbar/Navbar";

export default function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState();

  async function handleMainChange(e) {
    const checked = e.target.checked;
    if (checked) {
      try {
        const response = await axios.patch(
          `http://localhost:8080/article/${id}/set-main`,
          {},
          { withCredentials: true }
        );
        if (response.data.success) {
          setArticle((prev) => ({ ...prev, isMain: true }));
        }
      } catch (err) {
        console.error("Error setting main article", err);
      }
    }
  }

  useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await axios.get(
          `http://localhost:8080/article/${id}`,
          { withCredentials: true }
        );
        setArticle(response.data);
      } catch (err) {
        console.error("Error fetching article", err);
      }
    }
    fetchArticle();
  }, [id]);

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
  }

  if (!article) {
    return (
      <div className="container-main">
        <Navbar changeDisplay={() => {}} />
        <div className="container-article">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container-main">
      <Navbar changeDisplay={() => {}} />
      <div className="container-article">
        <div className="window-article">
          <h1 className="article-title">{article.title}</h1>
          <div className="article-meta">
            <span>{article.author}</span>
            <span>{dateFormat(article.creationTime)}</span>
          </div>
          <label className="main-checkbox">
            <input
              type="checkbox"
              checked={article.isMain}
              onChange={handleMainChange}
            />
            set as main article
          </label>
          {article.imagePath && (
            <img
              className="article-image"
              src={article.imagePath}
              alt="article"
            />
          )}
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          ></div>
        </div>
      </div>
    </div>
  );
}
