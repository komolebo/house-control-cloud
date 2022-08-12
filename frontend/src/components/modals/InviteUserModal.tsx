import React, {FC, useContext, useState} from "react";
import {useGlobalModalContext} from "./ModalProvider";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from "@mui/material";
import {h2Font, hBold, helpText} from "../../styles/common/fonts.css";
import logoInviteUsr from "../../assets/modal-invite-bag.svg";
import {DEFAULT_ROLE, ROLES, TDevRole} from "../../globals/DeviceData";
import {widerMuiBtn} from "../../styles/common/buttons.css";
import {nestPostInviteUser} from "../../http/rqData";
import {UserGlobalContext} from "../../globals/UserAuthProvider";
import ModalGenericDone, {IModalDoneDisplayInfo} from "./ModalGenericDone";

interface IInvitElemProp {
    onAction: (resInfo: IModalDoneDisplayInfo) => void
}

const MIN_CHAR_ID = 1;
const InviteUsrElement: FC<IInvitElemProp> = ({onAction}) => {
    const {modalProps } = useGlobalModalContext();
    const {data} = modalProps;
    const  {userInfo} = useContext(UserGlobalContext);

    const [userLogin, setUserLogin] = useState("");
    const [warning, setWarning] = useState("");
    const [role, setRole] = useState<number>(DEFAULT_ROLE);

    const handleInputChange = (e: any) => {
        const val = e.target.value;

        const no_num = /^[a-zA-Z_]/;
        const re = /^[0-9\b,a-zA-Z_]+$/;
        if (val === '' || (no_num.test(val[0]) && re.test(val))) {
            setUserLogin(val)
            setWarning("")
        }
    }
    const handleSelectChange = (e: SelectChangeEvent) => {
        const re = /^[0-9\b,A-F]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setRole(Number(e.target.value));
        }
    };
    const handleUserInvite = () => {
        userInfo && nestPostInviteUser(userInfo.id, data.devInfo.hex, userLogin, TDevRole[role])
            .then(resp => {
                if (resp.status === 201) {
                    onAction({
                        success: true,
                        header: `User invited`,
                        message: `User ${userLogin} can now access with rights ${role}`
                    });
                }
            })
            .catch(resp => {
                if (resp.response.status === 404) {
                    setWarning("User ID not found")
                } else if (resp.response.status === 409) {
                    onAction({
                        success: false,
                        header: `User not invited`,
                        message: `User ${userLogin} already connected to device ${data.devInfo.hex}`
                    });
                }
            })
    }

    return <>
        <div style={{display: "flex", alignItems: "center"}}>
            <img src={logoInviteUsr} id="logo-add-dev" alt={"logo-add-dev"}/>
            <Typography variant="h2"
                        className={hBold}
                        sx={{ml: 2}}
            > Invite by user ID </Typography>
        </div>

        <Box sx={{pt: 3, pb: 3}}>
            <div className={helpText}>
                Choosing role OWNER would require other owner’s access
            </div>
        </Box>


        <TextField sx={{mb: 2}}
                   error={warning !== ""}
                   label={warning !== "" ? "" : "User's login"}
                   id="textfield-invite-user"
                   color={"info"}
                   fullWidth={true}
                   helperText={warning}
                   onChange={e => handleInputChange(e)}
                   inputProps={{ pattern: "[a-f]{1,15}" }}
                   value={userLogin}
                   onKeyPress={e => e.key === 'Enter' && handleUserInvite()}
                   autoFocus
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
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                backgroundColor: "special.main",
                            }
                        }
                    }}
                >
                    {
                        ROLES.map((role, i) => {
                            return <MenuItem key={i} value={role}>
                                <Typography>{TDevRole[role]}</Typography>
                            </MenuItem>
                        })
                    }

                </Select>
            </FormControl>
        </Box>

        <Box sx={{display: "flex", justifyContent: "center", mt: 3}}>
            <Button variant={"contained"}
                    disabled={userLogin.length < MIN_CHAR_ID || role >= TDevRole.ROLES_NUMBER}
                    onClick={() => handleUserInvite()}
                    className={widerMuiBtn}
            >
                Invite user
            </Button>
        </Box>


    </>
}


export const InviteUserModal: FC = () => {
    const {modalProps, hideModal} = useGlobalModalContext();
    const [result, setResult] = useState<IModalDoneDisplayInfo>({} as IModalDoneDisplayInfo)

    const setModeDone = (res: IModalDoneDisplayInfo) => {
        setResult(res);
        modalProps.onAct(null);
    }
    const complete = () => {
        hideModal();
    }

    return (
        <div>
            { !result.header
                ? <InviteUsrElement
                    onAction={(resInfo) => setModeDone(resInfo)}
                />
                : <ModalGenericDone
                    onDone={() => complete()}
                    info={result}
                />
            }
        </div>
    )
}