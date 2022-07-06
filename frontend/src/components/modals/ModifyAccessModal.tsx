import React, {FC, useState} from "react";
import {ModalPageState, useGlobalModalContext} from "./ModalProvider";
import {Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {cntrContent, cntrVContent} from "../../styles/common/position.css";
import logoDone from "../../assets/done-big.svg";
import {h2Font, h3Font, h4Font, helpText} from "../../styles/common/fonts.css";
import logoBack from "../../assets/arrow-back.svg";
import logoUpdateAccess from "../../assets/modal-update-access.svg";
import {devItemDelim} from "../../styles/DeviceItem.css";
import {ColorRoleLabel} from "../elements/ColorRoleLabel";
import logoTransition from "../../assets/transition-arrow.svg"
import {ROLES, TConnectedUser, TDevItem, TDevRole} from "../../globals/DeviceData";
import {mediumMuiBtn, widerMuiBtn} from "../../styles/common/buttons.css";
import {postModifyAccess} from "../../http/rqData";
import {userInfo} from "os";

interface IModifyElemProp {
    onAction: (usrInfo: TConnectedUser | null) => void,
    devInfo: TDevItem,
    usrInfo: TConnectedUser,
}
interface IModifyAccessDoneProp {
    onAction: () => void,
    usrInfo?: TConnectedUser,
}

enum AccessActionTrigger {
    USER_ACCESS_UPDATE,
    USER_ACCESS_REMOVED,
    NONE
}

let accessActionTrigger: AccessActionTrigger = AccessActionTrigger.NONE;


const DoneElement: FC<IModifyAccessDoneProp> = ({onAction, usrInfo,}) => {
    const isUpdatePage = accessActionTrigger === AccessActionTrigger.USER_ACCESS_UPDATE;

    return <Box sx={{m: "10px 20px 10px 20px"}}>
        <div className={cntrContent}>
            <img src={logoDone} alt={"Job is done"}/>
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
                    onClick={() => onAction()}
                    startIcon={<img src={logoBack} alt={"Back to home"}/>}
                    className={widerMuiBtn}
            >
                Back to Home
            </Button>
        </div>
    </Box>
}

const UpdUsrAccessElement: FC<IModifyElemProp> = ({onAction, devInfo, usrInfo}) => {
    const [role, setRole] = useState<number>(usrInfo.role);

    const handleSelectChange = (e: SelectChangeEvent) => {
        setRole(Number(e.target.value));
    };

    const handleUpdAccess = () => {
        usrInfo.role = role;
        postModifyAccess(devInfo.hex, usrInfo.id, TDevRole[role])
            .then(() => {
                accessActionTrigger = AccessActionTrigger.USER_ACCESS_UPDATE;
                onAction(usrInfo);
            })
    }

    const handleRmAccess = () => {
        accessActionTrigger = AccessActionTrigger.USER_ACCESS_REMOVED;
        onAction(null);
    }

    return <div>
        <div className={h2Font} style={{display: "flex", alignItems: "center"}}>
            <img src={logoUpdateAccess} id="logo-clr-sett" alt={"logo-clr-sett"}/>
            &nbsp;&#160;Modify access right
        </div><br/>

        <Box sx={{pt: 2, pb: 2}}>
            <div className={helpText}>
                Here you can change non-OWNER user’s rights to access the device
            </div>
        </Box>

        <div className={[h3Font].join(' ')}>Device name</div>
        <div className={[h4Font, devItemDelim].join(' ')}>{devInfo.name}</div>

        <div className={[h3Font].join(' ')}>User</div>
        <div style={{display: "flex", flexDirection: "row"}}>
            <div className={[h4Font, cntrVContent].join(' ')} style={{marginRight: 15}}>
                {usrInfo.name}
            </div>
            <ColorRoleLabel role={usrInfo.role}/>
            {role !== usrInfo.role &&
                <div style={{display: "flex"}}>
                    <img src={logoTransition} style={{marginLeft: 5, marginRight: 5}} alt={"Transition logo"}/>
                    <ColorRoleLabel role={role}/>
                </div>
            }

        </div><br/><br/>

        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Select new role</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={role.toString()}
                    label="Select new role"
                    onChange={handleSelectChange}
                >
                    {
                        ROLES.map(role => {
                            return <MenuItem value={role}>{TDevRole[role]}</MenuItem>
                        })
                    }

                </Select>
            </FormControl>
        </Box>

        <Box sx={{display: "flex", flexDirection: "row", mt:2}}>
            <Button variant={"outlined"}
                    color={"error"}
                    sx={{
                        flexGrow: 1,
                        m: 1
                    }}
                    onClick={() => handleRmAccess()}
                    className={mediumMuiBtn}
            >
                Delete access
            </Button>

            <Button variant={"contained"}
                    sx={{
                        flexGrow: 1,
                        m: 1
                    }}
                    disabled={role === usrInfo.role}
                    onClick={() => handleUpdAccess()}
                    className={mediumMuiBtn}
            >
                Update access
            </Button>
        </Box>

    </div>
}


export const ModifyAccessModal: FC = () => {
    const {modalProps, hideModal} = useGlobalModalContext();
    const [pageMode, setPageMode] = useState(ModalPageState.ReqState)

    let {usrInfo, devInfo} = modalProps.data;

    const setModeDone = (_usrInfo: TConnectedUser | null) => {
        usrInfo = _usrInfo
        setPageMode(ModalPageState.DoneState);
        modalProps.onAct(null);
    }
    const complete = () => {
        setPageMode(ModalPageState.CompleteState);
        hideModal();
    }

    return (
        <div>
            { pageMode === ModalPageState.ReqState
                ? <UpdUsrAccessElement
                    onAction={(usrInfo) => setModeDone(usrInfo)}
                    devInfo={devInfo}
                    usrInfo={usrInfo}
                />
                : <DoneElement
                    onAction={() => complete()}
                    usrInfo={usrInfo}
                />
            }
        </div>
    )
}