import "./bigCard.css";
import placeholder from "../../../placeholder.svg";
import { useNavigate } from "react-router-dom";

export default function BigCard({ mainArticle }) {
  const navigate = useNavigate();
  if (!mainArticle) {
    return null;
  }
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

  return (
    <div className="container-bigCard">
      <div
        className="window-bigCard card"
        onClick={() => navigate(`/article/${mainArticle.id}`)}
      >
        {/* Navigate to the article page when the card is clicked */}
        <div className="top-bigCard">
          <img
            alt="big_banner"
            src={mainArticle.imagePath || placeholder}
            onError={(e) => {
              if (e.target.src !== placeholder) {
                e.target.src = placeholder; // Fallback to placeholder if image fails to load
              }
            }}
          />
        </div>
        <div className="bot-bigCard">
          <div className="card-title">{mainArticle.title}</div>
          <div className="card-author">
            <span>{mainArticle.author}</span>
            <span>{dateFormat(mainArticle.creationTime)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
