import React, {FC, useState} from "react";
import {flexr} from "../../styles/common/position.css";
import {ReactComponent as LogoHomeNet} from "../../assets/home-net.svg";
import {h4Font, hFont, underline} from "../../styles/common/fonts.css";
import {delimiter, loginPage, stickCntr} from "../../styles/Login.css";
import {Button, Card, Link, TextField, Typography, useTheme} from "@mui/material";
import {btn, imgHover} from "../../styles/common/buttons.css";
import {preLabel} from "../../styles/common/labels.css";
import {SIGNUP_PAGE, LOGIN_PAGE} from "../../utils/consts";
import {useNavigate} from "react-router-dom";
import {CheckYourEmailPage} from "./CheckEmailPage";
import {LoadingButton} from "@mui/lab";
import {log} from "util";
import {colBlue} from "../../styles/common/colors.css";
import {nestPostForgotPassword} from "../../http/auth";


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
            nestPostForgotPassword(login).then(resp => {
                if (resp.status === 201) {
                    onSent()
                }
            }).catch(({response}) => {
                setError(response.data.message)
            })
                .finally(() => setSending(false))
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

    return <Card id={loginPage} className="glow" >
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

        <div className={delimiter} /><br/>

        <div className={[stickCntr].join (' ')}>
            <Link
                underline="hover"
                className={[imgHover, colBlue].join(' ')}
                // onClick={() => navigate (AUTH_PAGE)}
            > Restore via Phone </Link>
        </div>

        <div
            className={[stickCntr].join(' ')}
            style={{padding: 0}}
        >
            <Typography variant="h6" sx={{p:0}}>or</Typography>
        </div>

        <div className={[stickCntr].join (' ')}>
            <Link
                underline="hover"
                className={[imgHover, colBlue].join(' ')}
                onClick={() => navigate (SIGNUP_PAGE)}
            > SIGN-UP </Link>
        </div>
    </Card>
}

export const ForgotPwdPage: FC = () => {
    const [emailSend, setEmailSent] = useState(false)

    return !emailSend
        ? <RestorePwdByEmail onSent={() => setEmailSent(true)}/>
        : <CheckYourEmailPage/>
}