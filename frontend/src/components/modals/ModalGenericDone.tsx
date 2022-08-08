import React, {FC} from "react";
import {Box, Button} from "@mui/material";
import {cntrContent} from "../../styles/common/position.css";
import logoDone from "../../assets/done-big.svg";
import logoFail from "../../assets/stop.svg";
import {h2Font, helpText} from "../../styles/common/fonts.css";
import logoBack from "../../assets/arrow-back.svg";
import {widerMuiBtn} from "../../styles/common/buttons.css";

export interface IModalDoneDisplayInfo {
    success: boolean;
    header: string;
    message: string;
}

export interface IPropDoneElem {
    onDone: () => void,
    info: IModalDoneDisplayInfo;
}


const ModalGenericDone: FC<IPropDoneElem> = ({onDone, info}) => {
    return <Box sx={{m: "10px 20px 10px 20px"}}>
        <div className={cntrContent}>
            { info.success
                ? <img src={logoDone} alt={"Logo job is done"}/>
                : <img src={logoFail} alt={"Logo denied"}/>
            }
        </div><br/>

        <div className={[h2Font, cntrContent].join(' ')}>
            { info.header }
        </div><br/>

        {/**/}
        <div className={[helpText, cntrContent].join(' ')}>
            { info.message }
        </div>
        {/*<div className={[helpText, cntrContent].join(' ')}>*/}
        {/*    to control the device again*/}
        {/*</div>*/}
        <br/><br/>

        <div className={cntrContent}>
            <Button variant={"contained"}
                    onClick={() => onDone()}
                    startIcon={<img src={logoBack} alt={"Logo get back"}/>}
                    className={widerMuiBtn}
                    autoFocus
            >
                Back to Home
            </Button>
        </div>
    </Box>
}

export default ModalGenericDone