import "./bigCard.css";
export default function BigCard({ mainArticle }) {
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
      <div className="window-bigCard card">
        <div className="top-bigCard">
          <img alt="big_banner" src={mainArticle.imagePath} />
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
