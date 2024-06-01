import React, {FC} from "react";
import {DevContainer} from "./devices/DevContainer";
import {socket, SocketContext} from "../http/wssocket";
import {commonPage} from "../styles/common/pages.css";
import {Typography} from "@mui/material";

const HomePage: FC = () => {
    return (
        <SocketContext.Provider value={socket}>
            <div className={commonPage}>
                <Typography sx={{mb: 1}} variant="h1" color="text.primary">Home</Typography>
                <Typography variant="h6" sx={{mt: 1}} color="text.primary">Here you can manage your devices</Typography>
                <DevContainer/>
            </div>
        </SocketContext.Provider>
    )
}

export default HomePage;