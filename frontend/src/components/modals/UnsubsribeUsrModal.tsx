import React, {FC, useState} from "react";
import {MODAL_TYPE, useGlobalModalContext} from "./ModalProvider";
import {Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {cntrContent, cntrVContent} from "../../styles/common/position.css";
import logoDone from "../../assets/done-big.svg";
import {h2Font, h3Font, h4Font, helpText} from "../../styles/common/fonts.css";
import {btnCommon} from "../../styles/common/buttons.css";
import logoBack from "../../assets/arrow-back.svg";
import {TConnectedUser, TDevItem, TDevRole} from "../devices/DevItem";
import logoUpdateAccess from "../../assets/modal-update-access.svg";
import {devItemDelim} from "../../styles/DeviceItem.css";
import {ColorRoleLabel} from "../elements/ColorRoleLabel";
import logoTransition from "../../assets/transition-arrow.svg"
import logoDisconnect from "../../assets/disconnect-device.svg";

interface IInvitElemProp {
    onAction: () => void,
    devInfo: TDevItem
}
interface IUpdAccessDoneProp {
    onAction: () => void,
    usrInfo?: TConnectedUser,
}

enum PageMode{
    ReqState,
    DoneState,
    CompleteState
}

enum AccessActionTrigger {
    USER_ACCESS_UPDATE,
    USER_ACCESS_REMOVED,
    NONE
}

const ROLES = Array.from(Array(TDevRole.ROLES_NUMBER).keys());
let accessActionTrigger: AccessActionTrigger = AccessActionTrigger.NONE;


const DoneElement: FC<IUpdAccessDoneProp> = ({onAction, usrInfo,}) => {
    const isUpdatePage = accessActionTrigger === AccessActionTrigger.USER_ACCESS_UPDATE;

    return <Box sx={{m: "10px 20px 10px 20px"}}>
        <div className={cntrContent}>
            <img src={logoDone}/>
        </div><br/>

        <div className={[h2Font, cntrContent].join(' ')}>
            {isUpdatePage
                ? "Access modified"
                : "Access removed"
            }
        </div><br/>

        {usrInfo && (
            isUpdatePage
            ?   <div className={[helpText, cntrContent].join(' ')}>
                    User '{usrInfo.name}' is now &nbsp;
                    <ColorRoleLabel role={usrInfo.role}/>
                </div>
            :   <div className={[helpText, cntrContent].join(' ')}>
                User '{usrInfo.name}' is disconnected from device:&nbsp;
            </div>
        )}
        <br/><br/>

        <div className={cntrContent}>
            <Button variant={"contained"}
                    className={btnCommon}
                    sx={{
                        width: 200, height: 42, borderRadius: 47,
                        textTransform: 'none'
                    }}
                    onClick={() => onAction()}
                    startIcon={<img src={logoBack}/>}
            >
                Back to Home
            </Button>
        </div>
    </Box>
}

const UnsubscribeUsrElement: FC<IInvitElemProp> = ({onAction, devInfo}) => {
    const handleUnsubscribe = () => {
        onAction();
    }

    return <div>
        <div className={h2Font} style={{display: "flex", alignItems: "center"}}>
            <img src={logoUpdateAccess} id="logo-clr-sett" alt={"logo-clr-sett"}/>
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
            <Button variant={"outlined"}
                    color={"info"}
                    endIcon={
                        <img src={logoDisconnect}/>
                    }
                    sx={{
                        height: 42,
                        borderRadius: 47,
                        textTransform: 'none',
                        m: 1
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
    const [pageMode, setPageMode] = useState(PageMode.ReqState)

    const {devInfo} = modalProps.data;

    const setModeDone = () => {
        // modalProps.onAct(usrData);
        setPageMode(PageMode.DoneState);
    }
    const complete = (dev_data: string) => {
        setPageMode(PageMode.CompleteState);
        hideModal();
    }

    return (
        <div>
            { pageMode === PageMode.ReqState
                ? <UnsubscribeUsrElement
                    onAction={() => setModeDone()}
                    devInfo={devInfo}
                />
                : <div>AAA</div>
                // <DoneElement
                //     onAction={() => complete("dummy data")}
                //     usrInfo={usrInfo}
                // />
            }
        </div>
        // <AddDevPopup onclose={() => handleModalToggle()} onact={() => handleModalToggle()}/>
    )
}