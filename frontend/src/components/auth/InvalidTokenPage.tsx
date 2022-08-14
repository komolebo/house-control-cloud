import React, {FC} from "react";
import {delimiter, loginPage, stickCntr} from "../../styles/Login.css";
import {Button, Typography} from "@mui/material";
import {LOGIN_PAGE} from "../../utils/consts";
import {useNavigate} from "react-router-dom";
import {ReactComponent as LogoFail} from "../../assets/stop.svg";

export const InvalidLinkPage: FC = () => {
    const navigate = useNavigate();

    return <div className={loginPage}>
        <div className={stickCntr}>
            <LogoFail width={100} height={100}/>
        </div>
        <br/>

        <div className={[stickCntr].join(' ')}>
            <Typography variant="h4">Sorry,</Typography>
            <Typography variant="h4">this link is not valid anymore</Typography>
        </div>

        <div className={delimiter} /><br/>

        <div className={[stickCntr].join (' ')}>
            <Button
                style={{height: 18}}
                onClick={() => navigate(LOGIN_PAGE)}
            >
                LOGIN
            </Button>
        </div>
    </div>
}