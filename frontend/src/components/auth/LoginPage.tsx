import React, {FC, useContext, useRef, useState} from "react";
import {
    delimiter,
    loginPage,
    stickCntr,
    stickRight
} from "../../styles/Login.css";
import {point, preLabel, warnLabel} from "../../styles/common/labels.css";
import {underline} from "../../styles/common/fonts.css";
import {btn} from "../../styles/common/buttons.css";
import {NavLink, useNavigate} from "react-router-dom";
import {AUTH_PAGE, FORGOT_PWD_PAGE, HOME_PAGE} from "../../utils/consts";
import {login} from "../../http/auth";
import {flexr} from "../../styles/common/position.css";
import {UserGlobalContext} from "../../globals/providers/UserAuthProvider";
import {ReactComponent as LogoHomeNet} from "../../assets/home-net.svg";

import {
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
    InputAdornment,
    TextField,
    Typography, useTheme
} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";

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
        login(values.login, values.password).then(
            ({data}) => {
                switch (data.status) {
                    case 401:
                        setValues({...values, warning: "Wrong login or password"})
                        break;
                    case 202:
                        setValues({...values, warning: ""})
                        setAuthData(data.token);
                        navigate(HOME_PAGE);
                        break;
                }
                console.log("good: ", data);
            }
        ).catch(({response}) => {
            switch (response.status) {
                case 422:
                    setValues({...values, warning: "Login or password is invalid"})
                    break;
            }
            console.log("catch: ", response);
        });
    }

    const handleKeyUp = (e: any, submit: boolean) => {
        if (e.key === "Enter") {
            submit ? signIn() : pwdFocusRef.current.focus();
        }
    };

    return (
        <div className={loginPage}>
            <div className={flexr}>
                <LogoHomeNet style={{ color: theme.palette.text.primary }} />
                <Typography variant="h1" sx={{ml: 1, mt: 1}}>Login</Typography>
            </div><br/>

            <div>
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
            </div><br/>

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
                                {values.showPassword ? <VisibilityOff /> : <Visibility />}
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

            <div>
                <label
                    className={[stickRight, point, preLabel].join(' ')}
                    onClick={() => navigate(FORGOT_PWD_PAGE)}
                >
                    Forgot Password?
                </label>
            </div>

            <div className={delimiter} />

            <div>
                <label className={[point, stickCntr, preLabel, underline].join(' ')}>
                    <NavLink to={AUTH_PAGE}>
                        Need an account? SIGN-UP
                    </NavLink>
                </label>
            </div>
        </div>
    )
}

export default LoginPage;