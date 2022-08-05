import React, {FC, useContext, useState} from "react";
import {useGlobalModalContext} from "./ModalProvider";
import {Box, Button, TextField} from "@mui/material";
import {h2Font, helpText} from "../../styles/common/fonts.css";
import logoAddDev from "../../assets/modal-add-dev.svg";
import {widerMuiBtn} from "../../styles/common/buttons.css";
import {nestPostReqRoleAccess} from "../../http/rqData";
import {TDevRole} from "../../globals/DeviceData";
import {UserGlobalContext} from "../../globals/UserAuthProvider";
import ModalGenericDone, {IModalDoneDisplayInfo} from "./ModalGenericDone";

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
                console.log("Success", res)
                if (res && res.status === 201) {
                    onAction({
                        success: true,
                        header: "Access requested",
                        message: "Please check device screen of wait"
                    })
                }
            })
            .catch(res => {
                console.log("Failed", res)
                if (res.response.status === 404) {
                    setWarning("Device does not exist")
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
        <div className={h2Font} style={{display: "flex", alignItems: "center"}}>
            <img src={logoAddDev} id="logo-add-dev" alt={"logo-add-dev"}/>
            &nbsp;&#160;Add device by ID
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
                   id="outlined-uncontrolled"
                   color={"info"}
                   fullWidth={true}
                   helperText={warning}
                   onChange={e => onInputChange(e)}
                   inputProps={{ pattern: "[a-f]{1,15}" }}
                   value={devHex}
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