import "./Home.css";
import BigCard from "../../components/Home/bigCard/bigCard";
import SmallCard from "../../components/Home/smallCard/smallCard";
import AddPost from "../../components/Home/addPost/addPost";

export default function Home({ display }) {

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
