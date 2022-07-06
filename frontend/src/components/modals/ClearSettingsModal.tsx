import React, {FC, useState} from "react";
import {h2Font, h4Font, helpText} from "../../styles/common/fonts.css";
import {Box, Button} from "@mui/material";
import logoDone from "../../assets/done-big.svg";
import {cntrContent} from "../../styles/common/position.css";
import logoBack from "../../assets/arrow-back.svg";
import {ModalPageState, useGlobalModalContext} from "./ModalProvider";
import logoAttention from "../../assets/modal-attention-round.svg";
import {TDevItem} from "../../globals/DeviceData";
import {shortMuiBtn, widerMuiBtn} from "../../styles/common/buttons.css";


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
            <img src={logoDone} alt={"Logo job is done"}/>
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
                    onClick={() => onDone()}
                    startIcon={<img src={logoBack} alt={"Logo get back"}/>}
                    className={widerMuiBtn}
            >
                Back to Home
            </Button>
        </div>
    </Box>
}

const ClrSettingElement: FC<IPropClrSetElem> = ({devInfo, onClear}) => {
    return <div>
        <div className={h2Font} style={{display: "flex", alignItems: "center"}}>
            <img src={logoAttention} id="logo-clr-sett" alt={"logo-clr-sett"}/>
            &nbsp;&#160;Clear device settings
        </div><br/><br/>

        <div className={h4Font}>
            '{devInfo.name}' on '{devInfo.ip}'
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
                        mt: 2

                    }}
                    onClick={() => onClear()}
                    className={shortMuiBtn}
            > Clear users </Button>

        </div>
    </div>
}

export const ClearSettingsModal: FC<IClrSettingsProp> = () => {
    const {modalProps } = useGlobalModalContext();
    const {onAct, onClose, data} = modalProps;
    let [pageState, setPageState] = useState(ModalPageState.ReqState)

    const handleClear = () => {
        // req to DB
        // devInfo.users = [];
        onAct(data);
        setPageState(ModalPageState.DoneState);
    }
    const handleComplete = () => {
        setPageState(ModalPageState.CompleteState);
        onClose();
    }

    return <div>
        {pageState === ModalPageState.ReqState
            ? <ClrSettingElement
                devInfo={data} onClear={() => handleClear()}
            />
            : <DoneElement
                onDone={() => handleComplete()}
            />
        }
    </div>
}