import "./Navbar.css";
export default function Navbar({username}) {
  return (
    <div className="container-navbar">
      <div className="window-navbar">
        <div className="title-navbar">blogg</div>
        <div className="test">{username}</div>
        <div className="add-navbar">+</div>
      </div>
    </div>
  );
}
