import React, {FC, useContext, useState} from "react";
import {useGlobalModalContext} from "./ModalProvider";
import {Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography} from "@mui/material";
import {cntrVContent} from "../../styles/common/position.css";
import {hBold, helpText} from "../../styles/common/fonts.css";
import logoUpdateAccess from "../../assets/modal-update-access.svg";
import {ColorRoleLabel} from "../elements/ColorRoleLabel";
import logoTransition from "../../assets/transition-arrow.svg"
import {ROLES, TConnectedUser, TDevItem, TDevRole} from "../../globals/DeviceData";
import {mediumMuiBtn} from "../../styles/common/buttons.css";
import {nestDeleteAccess, nestPostModifyAccess} from "../../http/rqData";
import {UserGlobalContext} from "../../globals/providers/UserAuthProvider";
import ModalGenericDone, {IModalDoneDisplayInfo} from "./ModalGenericDone";


import {StatusCodes} from "http-status-codes/build/es";

interface IModifyElemProp {
    onAction: (resInfo: IModalDoneDisplayInfo) => void,
    devInfo: TDevItem,
    objUserInfo: TConnectedUser,

}

const UpdUsrAccessElement: FC<IModifyElemProp> = ({onAction, devInfo, objUserInfo}) => {
    const [role, setRole] = useState<number>(objUserInfo.role);
    const {userInfo} = useContext(UserGlobalContext);

    const handleSelectChange = (e: SelectChangeEvent) => {
        setRole(Number(e.target.value));
    };

    const handleUpdAccess = () => {
        userInfo && nestPostModifyAccess(userInfo.id, devInfo.hex, objUserInfo.id, TDevRole[role])
            .then(resp => {
                if (resp.data === StatusCodes.CREATED) {
                    onAction({
                        success: true,
                        header: "Access rights updated",
                        message: `User ${objUserInfo.login} has now ${TDevRole[role]} access to ${devInfo.name}`,
                    });
                } else if (resp.data === StatusCodes.ACCEPTED) {
                    onAction({
                        success: true,
                        header: "Access rights requested",
                        message: `Owners have to approve OWNER rights for '${objUserInfo.login}'`
                    })
                }
            })
            .catch(resp => {
                console.log(resp)
                if (resp.response.status === StatusCodes.CONFLICT) {
                    onAction({
                        success: false,
                        header: "Pending request",
                        message: `Access rights not updated`,
                    });
                } else {
                    onAction({
                        success: false,
                        header: "Access rights not updated",
                        message: `Please retry later`,
                    });
                }
            })
    }

    const handleRmAccess = () => {
        userInfo && nestDeleteAccess(userInfo.id, devInfo.hex, objUserInfo.id)
            .then(() => {
                onAction({
                    success: true,
                    message: `User ${objUserInfo.login} has no access to ${devInfo.name} anymore`,
                    header: "Access right removed"
                });
            })
            .catch(resp => {
                onAction({
                    success: false,
                    header: "Access right not removed",
                    message: `Please retry later`,
                });
            })
    }

    return <div>
        <div style={{display: "flex", alignItems: "center"}}>
            <img src={logoUpdateAccess} id="logo-clr-sett" alt={"logo-clr-sett"}/>
            <Typography variant="h2"
                        className={hBold}
                        sx={{ml: 2}}
            > Modify access right </Typography>
        </div><br/>

        <Box sx={{pt: 2, pb: 2}}>
            <div className={helpText}>
                Here you can change non-OWNER user’s rights to access the device
            </div>
        </Box><br/>


        <Typography variant="h4" className={hBold}>Device name </Typography>
        <Typography variant="h3" sx={{m: "10px 0"}}>{devInfo.name}</Typography><br/>

        <Typography variant="h4" className={hBold}>User </Typography>
        <div style={{display: "flex", flexDirection: "row"}}>
            <Typography variant="h3" sx={{m: "10px 15px 10px 0"}} className={cntrVContent}>{objUserInfo.fullName}</Typography><br/>
            <ColorRoleLabel role={objUserInfo.role}/>
            {role !== objUserInfo.role &&
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
                            return <MenuItem
                                value={role}
                                key={i}
                            >
                                <Typography>{TDevRole[role]}</Typography>
                            </MenuItem>
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
                    disabled={role === objUserInfo.role}
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
    let {usrInfo, devInfo} = modalProps.data;
    const [result, setResult] = useState<IModalDoneDisplayInfo>({} as IModalDoneDisplayInfo)

    const setModeDone = (res: IModalDoneDisplayInfo) => {
        setResult(res)
    }
    const complete = () => {
        hideModal();
    }

    return (
        <div>
            { !result.header
                ? <UpdUsrAccessElement
                    onAction={(usrInfo) => setModeDone(usrInfo)}
                    devInfo={devInfo}
                    objUserInfo={usrInfo}
                />
                : <ModalGenericDone
                    onDone={() => complete()}
                    info={result}
                />
            }
        </div>
    )
}