import React, {FC, useContext, useState} from "react";
import {useGlobalModalContext} from "./ModalProvider";
import {Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography} from "@mui/material";
import {cntrVContent} from "../../styles/common/position.css";
import {h2Font, h3Font, h4Font, helpText} from "../../styles/common/fonts.css";
import logoUpdateAccess from "../../assets/modal-update-access.svg";
import {devItemDelim} from "../../styles/DeviceItem.css";
import {ColorRoleLabel} from "../elements/ColorRoleLabel";
import logoTransition from "../../assets/transition-arrow.svg"
import {ROLES, TConnectedUser, TDevItem, TDevRole} from "../../globals/DeviceData";
import {mediumMuiBtn} from "../../styles/common/buttons.css";
import {nestDeleteAccess, nestPostModifyAccess} from "../../http/rqData";
import {UserGlobalContext} from "../../globals/UserAuthProvider";
import ModalGenericDone, {IModalDoneDisplayInfo} from "./ModalGenericDone";

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
        objUserInfo.role = role; // TODO: check why is it needed
        userInfo && nestPostModifyAccess(userInfo.id, devInfo.hex, objUserInfo.id, TDevRole[role])
            .then(resp => {
                console.log(resp)
                onAction({
                    success: true,
                    message: `User ${objUserInfo.login} has now  ${role} access to ${devInfo.name}`,
                    header: "Access right updated"
                });
            })
            .catch(resp => {
                console.log(resp)
                onAction({
                    success: false,
                    header: "Access right not updated",
                    message: `Please retry later`,
                });
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
                {objUserInfo.fullName}
            </div>
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