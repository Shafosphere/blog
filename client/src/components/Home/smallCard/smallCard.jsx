import "./smallCard.css";
import { useNavigate } from "react-router-dom";
import placeholder from "../../../placeholder.svg";
export default function SmallCard({ smallArticles, dateFormat }) {
  const navigate = useNavigate();
  return (
    <div className="container-smallCard">
      <div
        className="window-smallCard card"
        onClick={() => navigate(`/article/${smallArticles.id}`)}
      >
        <div className="top-smallCard">
          <img
            alt="banner"
            src={smallArticles.imagePath || placeholder}
            onError={(e) => {
              if (e.target.src !== placeholder) {
                e.target.src = placeholder; // Fallback to placeholder if image fails to load
              }
            }}
          />
        </div>
        <div className="bot-smallCard">
          <div className="card-title">
            {smallArticles.title}
            <div className="card-description">{smallArticles.description}</div>
          </div>
          <div className="card-author">
            <span>{smallArticles.author}</span>
            <span>{dateFormat(smallArticles.creationTime)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
