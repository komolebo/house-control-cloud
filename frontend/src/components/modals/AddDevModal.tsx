import React, {FC, useContext, useState} from "react";
import {useGlobalModalContext} from "./ModalProvider";
import {Box, Button, TextField, Typography} from "@mui/material";
import {h2Font, hBold, helpText} from "../../styles/common/fonts.css";
import logoAddDev from "../../assets/modal-add-dev.svg";
import {widerMuiBtn} from "../../styles/common/buttons.css";
import {nestPostReqRoleAccess} from "../../http/rqData";
import {TDevRole} from "../../globals/DeviceData";
import {UserGlobalContext} from "../../globals/providers/UserAuthProvider";
import ModalGenericDone, {IModalDoneDisplayInfo} from "./ModalGenericDone";
import {StatusCodes} from "http-status-codes/build/es";

const MIN_CHAR_ID = 8;
interface IFinDevElem {
    onAction: (resInfo: IModalDoneDisplayInfo) => void
}


const FindDevElement: FC<IFinDevElem> = ({onAction}) => {
    const [devHex, setDevHex] = useState("0011AABB");
    const [warning, setWarning] = useState("");
    const {userInfo} = useContext(UserGlobalContext)

    const onInputChange = (e: any) => {
        const re = /^[0-9\b,A-F]+$/;
        const str = e.target.value.toUpperCase()
        if (str === '' || (re.test(str) && str.length <= MIN_CHAR_ID)) {
            setDevHex(str)
            setWarning("")
        }
    }

    const handleReqAccess = () => {
        userInfo && nestPostReqRoleAccess(userInfo.id, devHex, TDevRole[TDevRole.OWNER])
            .then(res => {
                if (res.status === StatusCodes.CREATED) {
                    onAction({
                        success: true,
                        header: "Access requested",
                        message: "Please check device screen"
                    })
                } else if (res.status === StatusCodes.ACCEPTED) {
                    onAction({
                        success: true,
                        header: "Access sent",
                        message: "Please wait for owners approval"
                    })
                }
            })
            .catch(res => {
                console.log(res)
                if (res.response.status === 404) {
                    setWarning(res.response.data.message)
                } else if(res.response.status === StatusCodes.CONFLICT) {
                    onAction({
                        success: false,
                        header: "Pending request",
                        message: "Your already requested access to this device"
                    })
                } else if(res.response.status === 400) {
                    onAction({
                        success: false,
                        header: "Access not requested",
                        message: res.response.data.message
                    })
                }
            })
    }

    return <div>
        <div style={{display: "flex", alignItems: "center"}}>
            <img src={logoAddDev} id="logo-add-dev" alt={"logo-add-dev"}/>
            &nbsp;&#160;
            <Typography variant="h2" className={hBold}>Add device by ID</Typography>
        </div>

        <Box sx={{pt: 4, pb: 0}}>
            <div className={helpText}>
                Please enter 8-char ID string mentioned on the device's frame:
            </div>
            <div className={helpText}>
                ID example: 012345AF
            </div>
        </Box>


        <TextField sx={{mt: 2, mb: 2}}
                   error={warning !== ""}
                   label={"Device ID"}
                   id="textfield-add-dev-modal"
                   color={"info"}
                   fullWidth={true}
                   helperText={warning}
                   onChange={e => onInputChange(e)}
                   inputProps={{ pattern: "[a-f]{1,15}" }}
                   value={devHex}
                   autoFocus
                   onKeyPress={e => e.key === 'Enter' && handleReqAccess()}
        />

        <Box sx={{display: "flex", justifyContent: "center", p: 1}}>
            <Button variant={"contained"}
                    disabled={devHex.length < MIN_CHAR_ID}
                    onClick={() => handleReqAccess()}
                    className={widerMuiBtn}
            >
                Request access
            </Button>
        </Box>
    </div>
}


export const AddDevModal: FC = () => {
    const { hideModal } = useGlobalModalContext();
    const [result, setResult] = useState<IModalDoneDisplayInfo>({} as IModalDoneDisplayInfo)

    const setModeDone = (resInfo: IModalDoneDisplayInfo) => {
        setResult(resInfo);
    }
    const complete = () => {
        hideModal()
    }

    return (
        <div>
            { !result.header
                ? <FindDevElement
                    onAction={(dev_data) => setModeDone(dev_data)}
                />
                : <ModalGenericDone
                    onDone={() => complete()}
                    info={result}
                />
            }
        </div>
    )
}