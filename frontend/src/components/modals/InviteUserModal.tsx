import React, {FC, useState} from "react";
import {useGlobalModalContext} from "./ModalProvider";
import {Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import {cntrContent} from "../../styles/common/position.css";
import logoDone from "../../assets/done-big.svg";
import {h2Font, helpText} from "../../styles/common/fonts.css";
import {btnCommon} from "../../styles/common/buttons.css";
import logoBack from "../../assets/arrow-back.svg";
import {TConnectedUser, TDevRole} from "../devices/DevItem";

interface IInvitElemProp {
    onAction: (dev_data: TConnectedUser) => void
}
interface IDoneProp {
    onAction: () => void
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

const DoneElement: FC<IDoneProp> = ({onAction}) => {
    return <Box sx={{m: "10px 20px 10px 20px"}}>
        <div className={cntrContent}>
            <img src={logoDone}/>
        </div><br/>

        <div className={[h2Font, cntrContent].join(' ')}>
            User invited
        </div><br/>

        <div className={[helpText, cntrContent].join(' ')}>
            User '{}' can now access with rights '{}'
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
        <div className={h2Font}>Invite by user ID</div>

        <Box sx={{pt: 2, pb: 2}}>
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

        <Box sx={{display: "flex", justifyContent: "center", p: 1}}>
            <Button variant={"contained"}
                    className={btnCommon}
                    sx={{
                        width: 200, height: 42, borderRadius: 47,
                        textTransform: 'none'
                    }}
                    disabled={userId.length < MIN_CHAR_ID || role >= TDevRole.ROLES_NUMBER}
                    onClick={() => handleReqAccess()}
            >
                Invite user
            </Button>
        </Box>


    </div>
}


export const InviteUserModal: FC = () => {
    const {modalProps, hideModal} = useGlobalModalContext();
    const [pageMode, setPageMode] = useState(PageMode.ReqState)

    const setModeDone = (usrData: TConnectedUser) => {
        console.log(usrData);
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
                ? <InviteUsrElement
                    onAction={usrData => setModeDone(usrData)}
                />
                : <DoneElement
                    onAction={() => complete("dummy data")}
                />
            }
        </div>
        // <AddDevPopup onclose={() => handleModalToggle()} onact={() => handleModalToggle()}/>
    )
}