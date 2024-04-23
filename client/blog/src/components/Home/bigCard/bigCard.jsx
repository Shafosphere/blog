import "./bigCard.css";
export default function BigCard() {
  return (
    <div className="container-bigCard">
      <div className="window-bigCard card">
        <div className="top-bigCard">
          <img
            alt="banner"
            src="https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg"
          />
        </div>
        <div className="bot-bigCard">
          <div className="card-title">
            International Artist Feature: Malaysia
          </div>
          <div className="card-author">Maciek z Bogdanca</div>
        </div>
      </div>
    </div>
  );
}
