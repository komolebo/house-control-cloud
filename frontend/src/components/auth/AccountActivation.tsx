import React, {FC, useContext, useEffect, useState} from "react";
import {h4Font, hFont} from "../../styles/common/fonts.css";
import {delimiter, loginPage, stickCntr} from "../../styles/Login.css";
import {Button, Card, Link, Typography} from "@mui/material";
import {ACTIVATE_ACCOUNT_PAGE, HOME_PAGE, LOGIN_PAGE, SIGNUP_PAGE} from "../../utils/consts";
import {useNavigate, useParams} from "react-router-dom";
import {ReactComponent as LogoActivate} from "../../assets/activate-account.svg";
import {nestPostActivateAccount, nestPostIsPendingActivation, nestPostResendEmail} from "../../http/auth";
import {data} from "browserslist";
import {UserGlobalContext} from "../../globals/providers/UserAuthProvider";
import {LoadingButton} from "@mui/lab";
import {preLabel} from "../../styles/common/labels.css";
import {imgHover} from "../../styles/common/buttons.css";
import {colBlue} from "../../styles/common/colors.css";

export const AccountActivationDisplayInfo: FC = () => {
    const navigate = useNavigate();
    const { email } = useParams();
    const [loading, setLoading] = useState(false);

    const redirectToLogin = () => {
        navigate(LOGIN_PAGE);
    }
    useEffect(() => {
        console.log(email)
        email && nestPostIsPendingActivation(email).then(resp => {
            if (resp.status === 201) {
                const isPendingActivation = resp.data;
                if (!isPendingActivation) {
                    redirectToLogin()
                }
            }
        }).catch(() => redirectToLogin())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleResend = () => {
        setLoading(true);
        email && nestPostResendEmail(email).then(resp => {
            if (resp.status === 201) {

            }
        }).finally(() => setLoading(false))
    }

    return <Card id={loginPage} className="glow" >
        <div className={[stickCntr].join(' ')}>
            <Typography variant="h1">Activate your account</Typography>
        </div>

        <div className={stickCntr}>
            <LogoActivate fill="#1690E9" width={100} height={100}/>
        </div>
        <br/><br/>

        <div className={[stickCntr].join(' ')}>
            <Typography variant="h3">
                We have sent you a link on "{email}" to activate your account
            </Typography>
        </div>

        <div className={delimiter} /><br/>

        <div className={stickCntr}>
            <LoadingButton
                style={{height: 18}}
                onClick={handleResend}
                loading={loading}
            >
                RESEND EMAIL
            </LoadingButton>
        </div>

        <div className={stickCntr} >
            <Typography variant="h6" color="secondary" sx={{padding: 0}}>or</Typography>
        </div>

        <div className={stickCntr}>
            <Link
                underline="hover"
                className={[imgHover, colBlue].join(' ')}
                onClick={() => navigate (SIGNUP_PAGE)}
            > SIGN-UP </Link>
        </div>
    </Card>
}

export const ActivateAccountPage: FC = () => {
    const {token} = useParams();
    const navigate = useNavigate();
    const {setAuthData} = useContext(UserGlobalContext);

    const redirectToLogin = () => {
        navigate(LOGIN_PAGE);
    }
    useEffect(() => {
        console.log("......", token)
        token && nestPostActivateAccount(token).then(resp => {
            console.log(">>>>>>>>>>>>>>", resp)
            if (resp.status === 201) {
                const {token, userInfo} = resp.data;
                setAuthData(token);
                navigate(HOME_PAGE);
            } else {
                redirectToLogin();
            }
        }).catch(resp => {
            console.log("<<<<<<<<<<<<<<<<", resp)
            redirectToLogin()
        })
    }, [])

    return <></>
}