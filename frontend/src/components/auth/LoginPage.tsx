import React, {FC, useContext, useRef, useState} from "react";
import {
    delimiter,
    loginPage,
    stickRight
} from "../../styles/Login.css";
import {warnLabel} from "../../styles/common/labels.css";
import {btn, imgHover} from "../../styles/common/buttons.css";
import {useNavigate} from "react-router-dom";
import {SIGNUP_PAGE, FORGOT_PWD_PAGE, HOME_PAGE} from "../../utils/consts";
import {login} from "../../http/auth";
import {cntrContent, flexr} from "../../styles/common/position.css";
import {UserGlobalContext} from "../../globals/providers/UserAuthProvider";
import {ReactComponent as LogoHomeNet} from "../../assets/home-net.svg";

import {
    Button, Card,
    Checkbox,
    FormControlLabel,
    IconButton,
    InputAdornment, Link,
    TextField,
    Typography, useTheme
} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {colBlue} from "../../styles/common/colors.css";

interface IState {
    showPassword: boolean;
    warning: string;
    login: string;
    password: string;
    rememberMe: boolean;
}

const LoginPage: FC = () => {
    const pwdFocusRef = useRef<any>();
    const navigate = useNavigate();
    const {setAuthData} = useContext(UserGlobalContext);
    const theme = useTheme();
    const [values, setValues] = useState<IState>({
        showPassword: false,
        warning: "",
        login: "",
        password: "",
        rememberMe: false
    })

    const signIn = () => {
        login(values.login, values.password).then(({data}) => {
                console.log(data)
                switch (data.status) {
                    case 401:
                        setValues({...values, warning: "Wrong login or password"})
                        break;
                    case 202:
                        setValues({...values, warning: ""})
                        setAuthData(data.token);
                        navigate(HOME_PAGE);
                        break;
                    default:
                        setValues({...values, warning: data.message})
                }
                console.log("good: ", data);
            }
        ).catch(({response}) => {
            switch (response.status) {
                case 422:
                    setValues({...values, warning: "Login or password is invalid"})
                    break;
                default:
                    setValues({...values, warning: response.data.message})
            }
            console.log("catch: ", response);
        });
    }

    const handleKeyUp = (e: any, submit: boolean) => {
        if (e.key === "Enter") {
            submit ? signIn() : pwdFocusRef.current.focus();
        }
    };

    return <Card id={loginPage} className="glow" >
        {/*<div className={loginPage}>*/}
            <div className={flexr}>
                <LogoHomeNet style={{ color: theme.palette.text.primary }} />
                <Typography variant="h1" sx={{ml: 2, mt: 2}}>Login</Typography>
            </div><br/><br/>

            <TextField
                id="outlined-multiline-flexible"
                label="Login or email"
                value={values.login}
                onChange={e => setValues({...values, login: e.target.value})}
                onKeyUp={e => handleKeyUp(e, false)}
                fullWidth
                autoFocus
                inputProps={{
                    input: {
                        "&:-webkit-autofill": {
                            WebkitBoxShadow: "0 0 0 1000px green inset",
                            backgroundColor: "yellow"
                        },
                        "&:-webkit-autofill:focus": {
                            transition: "background-color 600000s 0s, color 600000s 0s"
                        },
                    },
                }}
            />
            <br/><br/>

            <TextField
                id="outlined-adornment-password"
                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={e => setValues({...values, password: e.target.value})}
                InputProps={{
                    endAdornment:
                        <InputAdornment position="end">
                            <IconButton
                                onClick={e => setValues({...values, showPassword: !values.showPassword})}
                                edge="end"
                            >
                                {values.showPassword
                                    ? <VisibilityOff color="secondary"/>
                                    : <Visibility color="secondary"/>}
                            </IconButton>
                        </InputAdornment>
                }}
                label="New password"
                onKeyUp={e => handleKeyUp(e, true)}
                fullWidth
                inputRef={pwdFocusRef}
            />
            <br />

            <FormControlLabel
                value="end"
                control={
                    <Checkbox
                        onChange={e => setValues({...values, rememberMe: e.target.checked})}
                    />
                }
                label={
                    <Typography variant="body2" color="secondary">
                        Remember me?
                    </Typography>}
                labelPlacement="end"
            /><br/>

            {values.warning.length ? (
                <div className={[warnLabel].join(' ')}>{values.warning}</div>
            ): <></>
            }<br/><br/>

            <Button variant={"contained"}
                    onClick={() => signIn()}
                    className={[btn].join(' ')}
                    fullWidth
            >
                LOGIN
            </Button><br/>

            <div className={stickRight}>
                <Link
                    underline="hover"
                    color="secondary"
                    className={[imgHover].join(' ')}
                    onClick={() => navigate (FORGOT_PWD_PAGE)}
                > Forgot Password? </Link>
            </div>

            <div className={delimiter}/><br/>
            <div className={[cntrContent].join(' ')}>
                <Typography variant="h6" sx={{mr: 1, mt: .4}}>Need an account?</Typography>
                <Link
                    underline="hover"
                    color="info"
                    className={[imgHover, colBlue].join(' ')}
                    onClick={() => navigate (SIGNUP_PAGE)}
                > SIGN-UP </Link>
            </div>
        {/*</div>*/}
        </Card>
}

export default LoginPage;