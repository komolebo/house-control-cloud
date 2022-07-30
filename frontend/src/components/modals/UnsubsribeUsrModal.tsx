import React, {FC, useState} from "react";
import {ModalPageState, useGlobalModalContext} from "./ModalProvider";
import {Box, Button} from "@mui/material";
import {cntrContent} from "../../styles/common/position.css";
import logoDone from "../../assets/done-big.svg";
import {h2Font, helpText} from "../../styles/common/fonts.css";
import logoBack from "../../assets/arrow-back.svg";
import logoDisconnect from "../../assets/disconnect-device.svg";
import {TDevItem} from "../../globals/DeviceData";
import {widerMuiBtn} from "../../styles/common/buttons.css";

interface IUnsubElemProp {
    onAction: () => void,
    devInfo: TDevItem
}

interface IUnsubDoneElemProp {
    onAction: () => void,
    devInfo?: TDevItem,
}

const DoneElement: FC<IUnsubDoneElemProp> = ({onAction, devInfo}) => {
    return <Box sx={{m: "10px 20px 10px 20px"}}>
        <div className={cntrContent}>
            <img src={logoDone} alt={"Logo job is done"}/>
        </div><br/>

        <div className={[h2Font, cntrContent].join(' ')}>
            Successfully unsubscribed
        </div><br/>

        <div className={[helpText, cntrContent].join(' ')}>
            You have no access to "{devInfo?.name}" anymore
        </div><br/><br/>

        <div className={cntrContent}>
            <Button variant={"contained"}
                    onClick={() => onAction()}
                    startIcon={<img src={logoBack} alt={"Logo back to home"}/>}
                    className={widerMuiBtn}
            >
                Back to Home
            </Button>
        </div>
    </Box>
}

const UnsubscribeUsrElement: FC<IUnsubElemProp> = ({onAction, devInfo}) => {
    const handleUnsubscribe = () => {
        onAction();
    }

    return <div>
        <div className={h2Font} style={{display: "flex", alignItems: "center"}}>
            <img src={logoDisconnect} id="logo-clr-sett" alt={"logo-clr-sett"}/>
            &nbsp;&#160;Unsubscribe
        </div><br/>

        <Box sx={{pt: 2, pb: 2}}>
            <div className={helpText}>
                Press unsubsribe if you don’t need to connect
            </div>
            <div className={helpText}>
                to ‘{devInfo.name}’ anymore.
            </div>
        </Box>

        <div className={cntrContent}>
            <Button variant={"contained"}
                    sx={{
                        mt: 2
                    }}
                    onClick={() => handleUnsubscribe()}
            >
                Unsubscribe
            </Button>
        </div>

    </div>
}


export const UnsubscribeUsrModal: FC = () => {
    const {modalProps, hideModal} = useGlobalModalContext();
    const [pageMode, setPageMode] = useState(ModalPageState.ReqState)

    const {onAct} = modalProps;
    const {devInfo} = modalProps.data;

    const setModeDone = () => {
        onAct(devInfo);
        setPageMode(ModalPageState.DoneState);
    }
    const complete = () => {
        setPageMode(ModalPageState.CompleteState);
        hideModal();
    }

    return (
        <div>
            { pageMode === ModalPageState.ReqState
                ? <UnsubscribeUsrElement
                    onAction={() => setModeDone()}
                    devInfo={devInfo}
                />
                :
                <DoneElement
                    onAction={() => complete()}
                    devInfo={devInfo}
                />
            }
        </div>
    )
}