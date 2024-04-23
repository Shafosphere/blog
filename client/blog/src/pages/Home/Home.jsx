import "./Home.css"
import BigCard from "../../components/Home/bigCard/bigCard"
import SmallCard from "../../components/Home/smallCard/smallCard"
export default function Home(){
    return(
        <div className="container-home">
            <div className="window-home">
                <div className="title-home">
                    Cool Articles
                </div>
                <div className="content-home">
                    <BigCard/>
                    <SmallCard/>
                    <SmallCard/>
                    <SmallCard/>
                    <SmallCard/>
                    <SmallCard/>
                    <SmallCard/>
                </div>
            </div>
        </div>
    )
}