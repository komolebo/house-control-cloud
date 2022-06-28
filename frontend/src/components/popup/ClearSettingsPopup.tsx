import React, {FC, useState} from "react";
import {Popup} from "./Popup";
import {h2Font, h4Font, helpText} from "../../styles/common/fonts.css";
import {Box, Button, TextField} from "@mui/material";
import {btnCommon} from "../../styles/common/buttons.css";
import logoDone from "../../assets/done-big.svg";
import {cntrContent} from "../../styles/common/position.css";
import {TDevItem} from "../devices/DevItem";
import {devItemDelim} from "../../styles/DeviceItem.css";
import logoStart from "../../assets/arrow-start.svg";
import logoBack from "../../assets/arrow-back.svg";

enum PageState {
    ClearState,
    DoneState,
    CompleteState
}

interface IPropClrSetElem {
    devInfo: TDevItem,
    onClear: () => void
}
interface IPropDoneElem {
    onDone: () => void
}

interface IClrSettingsProp {
    onClose: () => void,
    onClear: (data: any) => void,
    devInfo: TDevItem
}

const DoneElement: FC<IPropDoneElem> = ({onDone}) => {
    return <Box sx={{m: "10px 20px 10px 20px"}}>
        <div className={cntrContent}>
            <img src={logoDone}/>
        </div><br/>

        <div className={[h2Font, cntrContent].join(' ')}>
            Device settings cleared
        </div><br/>

        <div className={[helpText, cntrContent].join(' ')}>
            Please go through initial device registration procedure
        </div>
        <div className={[helpText, cntrContent].join(' ')}>
            to control the device again
        </div>
        <br/><br/>

        <div className={cntrContent}>
            <Button variant={"contained"}
                    className={btnCommon}
                    sx={{
                        width: 200, height: 42, borderRadius: 47,
                        textTransform: 'none'
                    }}
                    onClick={() => onDone()}
                    startIcon={<img src={logoBack}/>}
            >
                Back to Home
            </Button>
        </div>
    </Box>
}

const ClrSettingElement: FC<IPropClrSetElem> = ({devInfo, onClear}) => {
    return <div>
        <div className={h2Font}>
            Clear device settings
        </div><br/><br/>

        <div className={h4Font}>
            Resetting '{devInfo.name}' on '{devInfo.ip}'!
        </div><br/>

        <div className={helpText}>
            Custom device settings will be deleted.
        </div>
        <div className={helpText}>
            All connected users will have lost their access rights.
        </div>
        <div className={helpText}>
            You will need device nearby to get a remote access again.
        </div><br/>

        <div className={cntrContent}>
            <Button variant={"contained"} color={"error"}
                    sx={{
                        width: 130, height: 42,
                        textTransform: 'none', borderRadius: 47, marginTop: 2

                    }}
                    onClick={() => onClear()}
            > Clear settings </Button>
        </div>
    </div>
}

export const ClearSettingsPopup: FC<IClrSettingsProp> = ({onClose, onClear, devInfo}) => {
    let [pageState, setPageState] = useState(PageState.ClearState)

    const handleClear = () => {
        // req to DB
        // devInfo.users = [];
        onClear(devInfo);
        setPageState(PageState.DoneState);
    }
    const handleComplete = () => {
        setPageState(PageState.CompleteState);
        onClose();
    }

    return <Popup onclose={onClose}>
        {pageState === PageState.ClearState
            ? <ClrSettingElement devInfo={devInfo} onClear={() => handleClear()}/>
            : <DoneElement onDone={() => handleComplete()}/>
        }
    </Popup>
}