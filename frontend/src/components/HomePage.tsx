import React, {FC, useState} from "react";
import {homePage} from "../styles/Home.css"
import {hFont, helpText} from "../styles/common/fonts.css";
import {DevContainer} from "./devices/DevContainer";

const HomePage: FC = () => {
    return (
        <div id={homePage}>
            <div className={hFont}>Home</div>
            <div className={helpText}>Here you can manage your devices</div>
            <br/>
            <DevContainer/>

            <div>Bottom part</div>

            {/*<button className={wideBtn}>*/}
            {/*    Add new device*/}
            {/*</button>*/}
        </div>
    )
}

export default HomePage;