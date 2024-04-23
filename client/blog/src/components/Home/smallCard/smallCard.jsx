import "./smallCard.css";
export default function SmallCard() {
  return (
    <div className="container-smallCard">
      <div className="window-smallCard card">
        <div className="top-smallCard">
          <img
            alt="banner"
            src="https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg"
          />
        </div>
        <div className="bot-smallCard">
          <div className="card-title">
            International Artist Feature: Malaysia
          </div>
          <div className="card-author">Maciek z Bogdanca</div>
        </div>
      </div>
    </div>
  );
}
