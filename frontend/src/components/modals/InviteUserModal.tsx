import React, {FC, useState} from "react";
import {useGlobalModalContext} from "./ModalProvider";
import {Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import {cntrContent} from "../../styles/common/position.css";
import logoDone from "../../assets/done-big.svg";
import {h2Font, helpText} from "../../styles/common/fonts.css";
import logoBack from "../../assets/arrow-back.svg";
import logoInviteUsr from "../../assets/modal-invite-bag.svg";
import {DEFAULT_ROLE, ROLES, TConnectedUser, TDevRole} from "../../globals/DeviceData";
import {widerMuiBtn} from "../../styles/common/buttons.css";

interface IInvitElemProp {
    onAction: (dev_data: TConnectedUser) => void
}
interface IDoneProp {
    onAction: () => void,
    usrInfo: TConnectedUser | null
}

const MIN_CHAR_ID = 6;

const checkUser = (name: string): Boolean => {
    return name === "12345678"
}

const DoneElement: FC<IDoneProp> = ({onAction, usrInfo}) => {
    const ROLE = usrInfo?.role ? TDevRole[usrInfo?.role] : "INVALID ROLE";
    const NAME = usrInfo?.name ? usrInfo.name : "INVALID NAME";

    return <Box sx={{m: "10px 20px 10px 20px"}}>
        <div className={cntrContent}>
            <img src={logoDone} alt={"Logo job is done"}/>
        </div><br/>

        <div className={[h2Font, cntrContent].join(' ')}>
            User invited
        </div><br/>

        <div className={[helpText, cntrContent].join(' ')}>
            User '{NAME}' can now access with rights '{ROLE}'
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

const InviteUsrElement: FC<IInvitElemProp> = ({onAction}) => {
    const [userId, setUserId] = useState("");
    const [warning, setWarning] = useState("");
    const [role, setRole] = useState<number>(DEFAULT_ROLE);

    const handleInputChange = (e: any) => {
        const re = /^[0-9\b,A-F]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setUserId(e.target.value)
        }
    }

    const handleSelectChange = (e: SelectChangeEvent) => {
        const re = /^[0-9\b,A-F]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setRole(Number(e.target.value));
        }
    };

    const handleReqAccess = () => {
        if (checkUser(userId)) {
            onAction({
                name: "New user", role: role, id: Number(userId)
            });
        }
        else {
            setWarning("User ID not found")
        }
    }
    return <div>
        <div className={h2Font} style={{display: "flex", alignItems: "center"}}>
            <img src={logoInviteUsr} id="logo-add-dev" alt={"logo-add-dev"}/>
            &nbsp;&#160;Invite by user ID
        </div>

        <Box sx={{pt: 3, pb: 3}}>
            <div className={helpText}>
                Choosing role OWNER would require other owner’s access
            </div>
        </Box>


        <TextField sx={{mb: 2}}
                   error={warning !== ""}
                   label={"User ID"}
                   id="outlined-uncontrolled"
                   color={"info"}
                   defaultValue={"0xFF0011AA"}
                   fullWidth={true}
                   helperText={warning}
                   onChange={e => handleInputChange(e)}
                   inputProps={{ pattern: "[a-f]{1,15}" }}
                   value={userId}
        />

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
        </Box>

        <Box sx={{display: "flex", justifyContent: "center", mt: 3}}>
            <Button variant={"contained"}
                    disabled={userId.length < MIN_CHAR_ID || role >= TDevRole.ROLES_NUMBER}
                    onClick={() => handleReqAccess()}
                    className={widerMuiBtn}
            >
                Invite user
            </Button>
        </Box>


    </div>
}


export const InviteUserModal: FC = () => {
    const {modalProps, hideModal} = useGlobalModalContext();
    const [userData, setUserData] = useState<TConnectedUser | null>(null);

    const setModeDone = (uData: TConnectedUser) => {
        console.log("setModeDone", uData);
        setUserData(uData);
        modalProps.onAct(uData);
    }
    const complete = () => {
        hideModal();
    }

    return (
        <div>
            { !userData
                ? <InviteUsrElement
                    onAction={usrData => setModeDone(usrData)}
                />
                : <DoneElement
                    onAction={() => complete()}
                    usrInfo={userData}
                />
            }
        </div>
    )
}