import "./smallCard.css";
export default function SmallCard({smallArticles, dateFormat}) {
  return (
    <div className="container-smallCard">
      <div className="window-smallCard card">
        <div className="top-smallCard">
          <img
            alt="banner"
            src={smallArticles.imagePath}
          />
        </div>
        <div className="bot-smallCard">
          <div className="card-title">
          {smallArticles.title}
          <div className="card-description">
            {smallArticles.description}
          </div>
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
