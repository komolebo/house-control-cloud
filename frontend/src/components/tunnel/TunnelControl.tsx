import React, {FC} from "react";
import {
    tunnelActionBtn,
    tunnelBaseInfoRecords,
    tunnelCommonItem,
    tunnelConnStat,
    tunnelCtrl
} from "../../styles/Tunnel.css"
import {Button, Typography} from "@mui/material";
import {shorterMuiBtn, wideMuiBtn} from "../../styles/common/buttons.css";
import {ReactComponent as LogoCircle} from "../../assets/circle.svg";
import {floatr} from "../../styles/common/position.css";
import {spaceTextEdit} from "../../styles/common/spaces.css";
import {ReactComponent as LogoUpdateLatest} from "../../assets/update-status-latest.svg";
import {ReactComponent as LogoUpdateOutdated} from "../../assets/update-status-outdated.svg";
import {lightTheme} from "../mui/lightThemeStyle";

export interface IProps {
    name: string,
    id: string,
    hw: string
    sw: string,
    latest: boolean,
    connected: boolean,
    onclose: () => void
}

const TabletConnStatus: FC<{ name: string, connected: boolean }> = ({name, connected}) => {
    return <div id={tunnelConnStat} className={tunnelCommonItem}>
        <Typography variant="h4">{name}</Typography>
        {connected ?
            <Button variant="text"
                    startIcon={<LogoCircle fill={lightTheme.palette.success.main}/>}
                    className={shorterMuiBtn}
                    color="success"
            > Connected
            </Button>
            :
            <Button variant="text"
                    startIcon={<LogoCircle fill={lightTheme.palette.error.main}/>}
                    className={shorterMuiBtn}
                    color="error"
            > Disconnected
            </Button>
        }

    </div>
}
const TabletIdInfo: FC<{ ID: string }> = ({ID}) => {
    return <div className={tunnelCommonItem}>
        <Typography variant="h4">ID</Typography>
        <Typography variant="h3" sx={{pt: 1}}>{ID}</Typography>
    </div>
}
const TabletHwInfo: FC<{ HW: string }> = ({HW}) => {
    return <div className={tunnelCommonItem}>
        <Typography variant="h4">HW version</Typography>
        <Typography variant="h3" sx={{pt: 1}}>{HW}</Typography>
    </div>
}
const TabletSwInfo: FC<{ SW: string, latest: boolean }> = ({SW, latest}) => {
    return <div className={tunnelCommonItem}>
        <Typography variant="h4">SW version</Typography>
        <div style={{display: "flex"}}>
            <Typography variant="h3" className={spaceTextEdit}>{SW}</Typography>
            {latest ?
                <Button variant="text"
                        startIcon={<LogoUpdateLatest stroke={lightTheme.palette.success.main}/>}
                        className={shorterMuiBtn}
                        color="success"
                > Latest
                </Button>
                :
                <Button variant="text"
                        startIcon={<LogoUpdateOutdated fill={lightTheme.palette.warning.main}/>}
                        className={shorterMuiBtn}
                        color="warning"
                > Update
                </Button>
            }
        </div>
    </div>
}

const TabletBaseInfoRecords: FC<{ ID: string, HW: string, SW: string, latest: boolean }> =
    ({ID, HW, SW, latest}) => {
        return <div id={tunnelBaseInfoRecords}>
            <TabletIdInfo ID={ID}/>
            <TabletHwInfo HW={HW}/>
            <TabletSwInfo SW={SW} latest={latest}/>
        </div>
    }

const TabletActionButtons: FC<{onclose: () => void}> = ({onclose}) => {
    return <div id={tunnelActionBtn}>
        <Button variant={"contained"}
                sx={{ml: 2}}
                color="error"
                onClick={onclose}
                className={[wideMuiBtn, floatr].join (' ')}
        >
            Disconnect
        </Button>
        <Button variant={"contained"}
                sx={{ml: 2}}
                color="info"
            // onClick={() => showModal(MODAL_TYPE.AddDevModal, {
            //     onClose: () => hideModal(),
            //     onAct: () => {}
            // })}
                className={[wideMuiBtn, floatr].join (' ')}
        >
            Refresh
        </Button>
    </div>
}

export const TunnelControl: FC<IProps> = ({name, id, hw, sw, latest, connected, onclose}) => {
    return <div id={tunnelCtrl}>
        <TabletConnStatus name={name} connected={connected}/>
        <TabletBaseInfoRecords ID={id} HW={hw} SW={sw} latest={latest}/>
        <TabletActionButtons onclose={onclose}/>
    </div>
}

export default TunnelControl;