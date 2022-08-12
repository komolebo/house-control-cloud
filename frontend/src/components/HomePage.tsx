import React, {FC} from "react";
import {hFont, helpText} from "../styles/common/fonts.css";
import {DevContainer} from "./devices/DevContainer";
import {socket, SocketContext} from "../http/wssocket";
import {commonPage} from "../styles/common/pages.css";
import {Typography} from "@mui/material";

const HomePage: FC = () => {
    return (
        <SocketContext.Provider value={socket}>
            <div className={commonPage}>
                <Typography sx={{mb: 1}} variant="h1">Home</Typography>
                <div className={helpText}>Here you can manage your devices</div>
                <br/>
                <DevContainer/>
            </div>
        </SocketContext.Provider>
    )
}

export default HomePage;