import React, {FC, useState} from "react";
import {flexr} from "../../styles/common/position.css";
import {ReactComponent as LogoHomeNet} from "../../assets/home-net.svg";
import {h4Font, hFont, underline} from "../../styles/common/fonts.css";
import {delimiter, loginPage, stickCntr} from "../../styles/Login.css";
import {Button, TextField, Typography, useTheme} from "@mui/material";
import {btn} from "../../styles/common/buttons.css";
import {preLabel} from "../../styles/common/labels.css";
import {LOGIN_PAGE} from "../../utils/consts";
import {useNavigate} from "react-router-dom";
import {CheckYourEmailPage} from "./CheckEmailPage";
import {LoadingButton} from "@mui/lab";
import {bestOPostForgotPassword} from "../../http/rqData";
import {log} from "util";


interface IPropRestorePwd {
    onSent: () => void
}

const RestorePwdByEmail: FC<IPropRestorePwd> = ({onSent}) => {
    const [login, setLogin] = useState("");
    const [error, setError] = useState("");
    const [isSending, setSending] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();

    const sendVerificationEmail = () => {
        const formatOk = login.match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
        if (!formatOk) {
            setError("Incorrect email format")
        } else {
            // setError("")
            setSending(true);
            bestOPostForgotPassword(login).then(resp => {
                if (resp.status === 201) {
                    onSent()
                }
            })
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
            <LogoHomeNet style={{ color: theme.palette.text.primary }} />
            <Typography variant="h1" sx={{ml: 2}}>Forgot password</Typography>
        </div><br/>

        <Typography variant="h5">Please enter your email address to receive
            instructions for restoring a password</Typography>
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

        <LoadingButton variant={"contained"}
                onClick={() => sendVerificationEmail()}
                className={[btn].join(' ')}
                fullWidth
                loadingPosition="end"
                loading={isSending}
                endIcon={<></>}
        >
            SEND VERIFICATION EMAIL
        </LoadingButton>
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

export const ForgotPwdPage: FC = () => {
    const [emailSend, setEmailSent] = useState(false)

    return !emailSend
        ? <RestorePwdByEmail onSent={() => setEmailSent(true)}/>
        : <CheckYourEmailPage/>
}