import React, {FC, useState} from "react";
import {h2Font, h4Font, helpText} from "../../styles/common/fonts.css";
import {Box, Button} from "@mui/material";
import logoDone from "../../assets/done-big.svg";
import {cntrContent, cntrVContent, flexG1, flexr} from "../../styles/common/position.css";
import logoBack from "../../assets/arrow-back.svg";
import {ModalPageState, useGlobalModalContext} from "./ModalProvider";
import logoAttention from "../../assets/attention.svg";
import logoDeleteAcc from "../../assets/delete-account-big.svg";
import {TDevItem} from "../../globals/DeviceData";
import {wideMuiBtn, widerMuiBtn} from "../../styles/common/buttons.css";
import {colRedText} from "../../styles/common/colors.css";
import {LoadingButton} from "@mui/lab";


interface IDelAccountElem {
    devInfo: TDevItem,
    onClear: () => void,
    onClose: () => void
}
interface IPropDoneElem {
    onDone: () => void
}

interface IProp {
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
            Account deleted completely
        </div><br/>

        <div className={[helpText, cntrContent].join(' ')}>
            Register to access the device again
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

const ClrSettingElement: FC<IDelAccountElem> = ({devInfo, onClear, onClose}) => {
    const [loading, setLoading] = useState(false)

    const handleClear = () => {
        setLoading(true)
    }

    return <div>
        <div className={flexr}>
            <div style={{width: "40px"}}>
                <img src={logoDeleteAcc} id="logo-clr-sett" alt={"logo-clr-sett"}/>
            </div>
            <div style={{width: "100%"}}>
                <div className={h2Font} style={{display: "flex", alignItems: "center"}}>
                    Delete account
                </div>
                <br/>

                <div className={helpText}>
                    Please acknowledge the account deletion consequences
                </div>
                <br/><br/>


                <div className={[h4Font, cntrVContent, colRedText].join (' ')} style={{marginBottom: 10}}>
                    <img src={logoAttention} id="logo-clr-sett" alt={"logo-clr-sett"} style={{marginRight: 10}}/>
                    You will be removed from connected devices
                </div>
                <div className={[h4Font, cntrVContent, colRedText].join (' ')}>
                    <img src={logoAttention} id="logo-clr-sett" alt={"logo-clr-sett"} style={{marginRight: 10}}/>
                    Devices you own alone will be cleared out of users
                </div>
                <br/>
            </div>
        </div>
        <div className={flexr}>
            <div className={[cntrContent, flexG1].join (' ')}>
                <LoadingButton
                    variant={"outlined"}
                    endIcon={<></>}
                    color={"error"}
                    sx={{
                        mt: 2
                    }}
                    onClick={() => handleClear()}
                    className={wideMuiBtn}
                    loadingPosition="end"
                    loading={loading}
                > Delete account </LoadingButton>
            </div>

            <div className={[cntrContent, flexG1].join (' ')}>
                <Button variant={"contained"}
                        sx={{
                            mt: 2
                        }}
                        onClick={() => onClose()}
                        className={wideMuiBtn}
                        disabled={loading}
                > Cancel </Button>
            </div>
        </div>
    </div>
}

export const DeleteAccountModal: FC<IProp> = () => {
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
                devInfo={data} onClear={() => handleClear()} onClose={onClose}
            />
            : <DoneElement
                onDone={() => handleComplete()}
            />
        }
    </div>
}