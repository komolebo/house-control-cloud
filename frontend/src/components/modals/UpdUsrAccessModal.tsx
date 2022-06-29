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

interface IInvitElemProp {
    onAction: (dev_data: TConnectedUser) => void,
    devInfo: TDevItem,
    usrInfo: TConnectedUser
}
interface IUpdAccessDoneProp {
    onAction: () => void,
    usrInfo: TConnectedUser
}

enum PageMode{
    ReqState,
    DoneState,
    CompleteState
}

const MIN_CHAR_ID = 6;
const ROLES = Array.from(Array(TDevRole.ROLES_NUMBER).keys());
const DEFAULT_ROLE = TDevRole.GUEST;

const checkUser = (name: string): Boolean => {
    return name === "12345678"
}

const DoneElement: FC<IUpdAccessDoneProp> = ({onAction, usrInfo}) => {
    return <Box sx={{m: "10px 20px 10px 20px"}}>
        <div className={cntrContent}>
            <img src={logoDone}/>
        </div><br/>

        <div className={[h2Font, cntrContent].join(' ')}>
            Access modified
        </div><br/>

        <div className={[helpText, cntrContent].join(' ')}>
            User '{usrInfo.name}' has now access rights:&nbsp;
            <ColorRoleLabel role={usrInfo.role}/>
        </div><br/><br/>

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

const UpdUsrAccessElement: FC<IInvitElemProp> = ({onAction, devInfo, usrInfo}) => {
    const [role, setRole] = useState<number>(DEFAULT_ROLE);

    const handleSelectChange = (e: SelectChangeEvent) => {
        setRole(Number(e.target.value));
    };

    const handleReqAccess = () => {
        usrInfo.role = role;
        onAction(usrInfo);
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

        <div className={[h3Font].join(' ')}>Name</div>
        <div className={[h4Font, devItemDelim].join(' ')}>{devInfo.name}</div>

        <div className={[h3Font].join(' ')}>User</div>
        <div style={{display: "flex", flexDirection: "row"}}>
            <div className={[h4Font, cntrVContent].join(' ')} style={{marginRight: 15}}>
                {usrInfo.name}
            </div>
            <ColorRoleLabel role={usrInfo.role}/>
        </div><br/><br/>

        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Select Role</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={role.toString()}
                    label="Select Role"
                    onChange={handleSelectChange}
                >
                    {
                        ROLES.map(role => {
                            return <MenuItem value={role}>{TDevRole[role]}</MenuItem>
                        })
                    }

                </Select>
            </FormControl>
        </Box><br/>

        <Box sx={{display: "flex", justifyContent: "center", p: 1}}>
            <Button variant={"contained"}
                    className={btnCommon}
                    sx={{
                        width: 200, height: 42, borderRadius: 47,
                        textTransform: 'none'
                    }}
                    disabled={role === usrInfo.role}
                    onClick={() => handleReqAccess()}
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

    const setModeDone = (usrData: TConnectedUser) => {
        modalProps.onAct(usrData);
        setPageMode(PageMode.DoneState);
    }
    const complete = (dev_data: string) => {
        setPageMode(PageMode.CompleteState);
        hideModal();
    }

    return (
        <div>
            { pageMode === PageMode.ReqState
                ? <UpdUsrAccessElement
                    onAction={usrData => setModeDone(usrData)}
                    devInfo={devInfo}
                    usrInfo={usrInfo}
                />
                : <DoneElement
                    onAction={() => complete("dummy data")}
                    usrInfo={usrInfo}
                />
            }
        </div>
        // <AddDevPopup onclose={() => handleModalToggle()} onact={() => handleModalToggle()}/>
    )
}