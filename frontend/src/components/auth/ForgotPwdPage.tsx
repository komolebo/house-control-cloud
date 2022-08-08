import React, {FC, useState} from "react";
import {flexr} from "../../styles/common/position.css";
import logoHomeNet from "../../assets/home-net-black.svg";
import {h4Font, hFont, underline} from "../../styles/common/fonts.css";
import {delimiter, loginPage, stickCntr} from "../../styles/Login.css";
import {Button, TextField} from "@mui/material";
import {btn} from "../../styles/common/buttons.css";
import {preLabel} from "../../styles/common/labels.css";
import {LOGIN_PAGE} from "../../utils/consts";
import {useNavigate} from "react-router-dom";


export const ForgotPwdPage: FC = () => {
    const [login, setLogin] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const sendVerificationEmail = () => {
        const formatOk = login.match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
        if (!formatOk) {
            setError("Incorrect email format")
        } else {
            setError("")
        }
    }
    const handleLoginInput = (e: any) => {
        setLogin(e.target.value)
        setError("")
    }
    const handleKeyUp = (e: any) => {
        if (e.key === "Enter") {
            sendVerificationEmail()
        }
    };

    return <div className={loginPage}>
        <div className={flexr}>
            <img src={logoHomeNet} alt={"HomeNet logo"}/>
            <p className={[hFont].join(' ')}>&nbsp;Forgot password</p>
        </div><br/>

        <div className={[h4Font].join(' ')}>Please enter your email address to receive
            instructions for restoring a password
        </div>
        <br/><br/>

        <TextField
            id="restore-password-field"
            sx={{width: "100%"}}
            error={error.length > 0}
            label="Email"
            value={login}
            helperText={error}
            onChange={handleLoginInput}
            onKeyUp={handleKeyUp}
            autoFocus
        />
        <br/><br/><br/>

        <Button variant={"contained"}
                onClick={() => sendVerificationEmail()}
                className={[btn].join(' ')}
                fullWidth
        >
            SEND VERIFICATION EMAIL
        </Button>
        <br/>

        <div className={delimiter} /><br/>

        <div className={[stickCntr].join (' ')}>
            <Button
                style={{height: 18}}
            >
                Restore via phone
            </Button>
        </div>

        <div
            className={[stickCntr, preLabel].join(' ')}
            style={{padding: 0}}
        >
            or
        </div>

        <div className={[stickCntr].join (' ')}>
            <Button
                style={{height: 18 }}
                onClick={() => navigate(LOGIN_PAGE)}
                className={underline}
            >
                LOGIN
            </Button>
        </div>
    </div>
}