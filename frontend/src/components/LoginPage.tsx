import React, {FC, useContext, useRef, useState} from "react";
import {
    delimiter,
    loginPage,
    stickCntr,
    stickRight
} from "../styles/Login.css";
import {point, preLabel, warnLabel} from "../styles/common/labels.css";
import {hFont, underline} from "../styles/common/fonts.css";
import {btn} from "../styles/common/buttons.css";
import {NavLink, useNavigate} from "react-router-dom";
import {AUTH_PAGE, HOME_PAGE} from "../utils/consts";
import {login} from "../web/http/auth";
import {flexr, wide} from "../styles/common/position.css";
import {UserAuthContext} from "../globals/UserAuthProvider";
import logoHomeNet from "../assets/home-net-black.svg";
import {
    Button,
    Checkbox,
    FormControl, FormControlLabel,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography
} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";

interface IState {
    showPassword: boolean;
    warning: string;
    email: string;
    password: string;
    rememberMe: boolean;
}

const LoginPage: FC = () => {
    const pwdFocusRef = useRef<any>();
    const navigate = useNavigate();
    const {setAuthData} = useContext(UserAuthContext);
    const [values, setValues] = useState<IState>({
        showPassword: false,
        warning: "",
        email: "",
        password: "",
        rememberMe: false
    })

    const signIn = () => {
        login(values.email, values.password).then(
            ({data}) => {
                switch (data.status) {
                    case 401:
                        setValues({...values, warning: "Wrong email or password"})
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
                    setValues({...values, warning: "Email or password is invalid"})
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
                <img src={logoHomeNet} alt={"HomeNet logo"}/>
                <p className={[hFont].join(' ')}>&nbsp;Login</p>
            </div><br/>

            <div>
                <TextField
                    sx={{width: "100%"}}
                    id="outlined-multiline-flexible"
                    label="Email"
                    maxRows={4}
                    value={values.email}
                    onChange={e => setValues({...values, email: e.target.value})}
                    onKeyUp={e => handleKeyUp(e, false)}
                />
            </div><br/>

            <FormControl sx={{ width: '100%' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-password"
                    type={values.showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={e => setValues({...values, password: e.target.value})}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={e => setValues({...values, showPassword: !values.showPassword})}
                                edge="end"
                            >
                                {values.showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                    label="Password"
                    onKeyUp={e => handleKeyUp(e, true)}
                />
            </FormControl><br />

            <FormControlLabel
                value="end"
                control={
                    <Checkbox
                        onChange={e => setValues({...values, rememberMe: e.target.checked})}
                    />
                }
                label={
                    <Typography variant="body2" color="textSecondary">
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
                    className={[wide, btn].join(' ')}
            >
                LOGIN
            </Button><br/>

            <div>
                <label className={[stickRight, point, preLabel].join(' ')}>
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