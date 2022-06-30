import React, {FC, useState} from "react";
import {useGlobalModalContext} from "./ModalProvider";
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

interface IInvitElemProp {
    onAction: () => void,
    devInfo: TDevItem,
    usrInfo: TConnectedUser
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
                    className={btnCommon}
                    sx={{
                        width: 200, height: 42, borderRadius: 47,
                        textTransform: 'none'
                    }}
                    onClick={() => onAction()}
                    startIcon={<img src={logoBack} alt={"Back to home"}/>}
            >
                Back to Home
            </Button>
        </div>
    </Box>
}

const UpdUsrAccessElement: FC<IInvitElemProp> = ({onAction, devInfo, usrInfo}) => {
    const [role, setRole] = useState<number>(usrInfo.role);

    const handleSelectChange = (e: SelectChangeEvent) => {
        setRole(Number(e.target.value));
    };

    const handleUpdAccess = () => {
        usrInfo.role = role;
        accessActionTrigger = AccessActionTrigger.USER_ACCESS_UPDATE;
        onAction();
    }

    const handleRmAccess = () => {
        devInfo.users = devInfo.users.filter(e => e !== usrInfo);
        accessActionTrigger = AccessActionTrigger.USER_ACCESS_REMOVED;
        onAction();
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
                        width: 150,
                        height: 42,
                        borderRadius: 47,
                        textTransform: 'none',
                        flexGrow: 1,
                        m: 1
                    }}
                    onClick={() => handleRmAccess()}
            >
                Delete access
            </Button>

            <Button variant={"contained"}
                    sx={{
                        width: 150, height: 42, borderRadius: 47,
                        textTransform: 'none',
                        flexGrow: 1,
                        m: 1
                    }}
                    disabled={role === usrInfo.role}
                    onClick={() => handleUpdAccess()}
            >
                Update access
            </Button>
        </Box>

    </div>
}


export const UpdUsrAccessModal: FC = () => {
    const {modalProps, hideModal} = useGlobalModalContext();
    const [pageMode, setPageMode] = useState(PageMode.ReqState)

    const {usrInfo, devInfo} = modalProps.data;

    const setModeDone = () => {
        setPageMode(PageMode.DoneState);
    }
    const complete = () => {
        setPageMode(PageMode.CompleteState);
        hideModal();
    }

    return (
        <div>
            { pageMode === PageMode.ReqState
                ? <UpdUsrAccessElement
                    onAction={() => setModeDone()}
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