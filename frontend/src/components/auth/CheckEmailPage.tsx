import React, {FC} from "react";
import {h4Font, hFont} from "../../styles/common/fonts.css";
import {delimiter, loginPage, stickCntr} from "../../styles/Login.css";
import {Button, Typography} from "@mui/material";
import {LOGIN_PAGE} from "../../utils/consts";
import {useNavigate} from "react-router-dom";
import {ReactComponent as LogoDone} from "../../assets/done-big.svg";

export const CheckYourEmailPage: FC = () => {
    const navigate = useNavigate();


    return <div className={loginPage}>
        <div className={[stickCntr].join(' ')}>
            <Typography variant="h1">Check your email</Typography>
        </div>

        <div className={stickCntr}>
            <LogoDone fill="#1690E9" width={100} height={100}/>
        </div>
        <br/><br/>

        <div className={[stickCntr].join(' ')}>
            <Typography variant="h3">We have sent you a reset pasword link on your registered email address</Typography>
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