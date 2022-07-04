import React, {FC} from "react";
import {homePage} from "../styles/Home.css"
import {hFont, helpText} from "../styles/common/fonts.css";
import {DevContainer} from "./devices/DevContainer";
import {NavBar} from "./NavBar";
import {BrowserRouter} from "react-router-dom";

const HomePage: FC = () => {
    return (
        <div>
            <NavBar/>
            <div id={homePage}>
                <div className={hFont}>Home</div>
                <div className={helpText}>Here you can manage your devices</div>
                <br/>
                <DevContainer/>

                <div>Bottom part</div>
            </div>
        </div>
    )
}

export default HomePage;