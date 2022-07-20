import React, {FC} from "react";
import {hFont, helpText} from "../styles/common/fonts.css";
import {DevContainer} from "./devices/DevContainer";
import {socket, SocketContext} from "../http/wssocket";
import {commonPage} from "../styles/common/pages.css";

const HomePage: FC = () => {
    return (
        <SocketContext.Provider value={socket}>
            <div className={commonPage}>
                <div className={hFont}>Home</div>
                <div className={helpText}>Here you can manage your devices</div>
                <br/>
                <DevContainer/>

                <div>Bottom part</div>
            </div>
        </SocketContext.Provider>
    )
}

export default HomePage;