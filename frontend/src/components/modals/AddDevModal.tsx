import React, {FC, useState} from "react";
import {ModalPageState, useGlobalModalContext} from "./ModalProvider";
import {Box, Button, TextField} from "@mui/material";
import {cntrContent} from "../../styles/common/position.css";
import logoDone from "../../assets/done-big.svg";
import {h2Font, helpText} from "../../styles/common/fonts.css";
import {btnCommon} from "../../styles/common/buttons.css";
import logoBack from "../../assets/arrow-back.svg";
import logoAddDev from "../../assets/modal-add-dev.svg";

const MIN_CHAR_ID = 8;
interface IFinDevElem {
    onAction: (dev_data: string) => void
}

function checkName(value: string) {
    return value === "12345678";
}

const DoneElement: FC<IFinDevElem> = ({onAction}) => {
    return <Box sx={{m: "10px 20px 10px 20px"}}>
        <div className={cntrContent}>
            <img src={logoDone} alt={"Logo done"}/>
        </div><br/>

        <div className={[h2Font, cntrContent].join(' ')}>
            Access requested
        </div><br/>

        <div className={[helpText, cntrContent].join(' ')}>
            Please check device screen of wait
        </div>
        <div className={[helpText, cntrContent].join(' ')}>
            for owner’s approval
        </div><br/><br/>

        <div className={cntrContent}>
            <Button variant={"contained"}
                    className={btnCommon}
                    sx={{
                        width: 200, height: 42, borderRadius: 47,
                        textTransform: 'none'
                    }}
                    onClick={() => onAction("Finaly requested rights")}
                    startIcon={<img src={logoBack} alt={"Logo get back"}/>}
            >
                Back to Home
            </Button>
        </div>
    </Box>
}

const FindDevElement: FC<IFinDevElem> = ({onAction}) => {
    const [deviceId, setDeviceID] = useState("");
    const [warning, setWarning] = useState("");

    const onInputChange = (e: any) => {
        const re = /^[0-9\b,A-F]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setDeviceID(e.target.value)
        }
    }

    const handleReqAccess = () => {
        if (checkName(deviceId)) {
            onAction("Test dev data");
        }
        else {
            setWarning("Incorrect ID")
        }
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
                   defaultValue={"0xFF0011AA"}
                   fullWidth={true}
                   helperText={warning}
                   onChange={e => onInputChange(e)}
                   inputProps={{ pattern: "[a-f]{1,15}" }}
                   value={deviceId}
        />

        <Box sx={{display: "flex", justifyContent: "center", p: 1}}>
            <Button variant={"contained"}
                    className={btnCommon}
                    sx={{
                        width: 200, height: 42, borderRadius: 47,
                        textTransform: 'none'
                    }}
                    disabled={deviceId.length < MIN_CHAR_ID}
                    onClick={() => handleReqAccess()}
            >
                Request access
            </Button>
        </Box>
    </div>
}


export const AddDevModal: FC = () => {
    const { modalProps} = useGlobalModalContext();
    const [pageMode, setPageMode] = useState(ModalPageState.ReqState)

    const setModeDone = (dev_data: string) => {
        console.log(dev_data);
        setPageMode(ModalPageState.DoneState);
    }
    const complete = () => {
        setPageMode(ModalPageState.CompleteState);
        modalProps.onAct("some data");
    }

    return (
        <div>
            { pageMode === ModalPageState.ReqState
                ? <FindDevElement onAction={(dev_data) => setModeDone(dev_data)}/>
                : <DoneElement onAction={() => complete()}/>
            }
        </div>
        // <AddDevPopup onclose={() => handleModalToggle()} onact={() => handleModalToggle()}/>
    )
}