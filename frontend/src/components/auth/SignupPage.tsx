import React, {FC, useState} from "react";
import {useNavigate} from "react-router-dom";
import {delimiter, loginPage, warnContainer} from "../../styles/Login.css";
import {warnLabel} from "../../styles/common/labels.css";
import {btn, imgHover} from "../../styles/common/buttons.css";
import {ACTIVATE_ACCOUNT_INFO, LOGIN_PAGE} from "../../utils/consts";
import {register} from "../../http/auth";
import {cntrContent, flexr} from "../../styles/common/position.css";
import {
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel, Link,
    OutlinedInput,
    TextField, Typography,
    useTheme
} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {ReactComponent as LogoHomeNet} from "../../assets/home-net.svg";
import {colBlue} from "../../styles/common/colors.css";
import {LoadingButton} from "@mui/lab";

interface IState {
    showPassword: boolean;
    password: string;
    email: string;
    warnings: Array<string>;
    name: string;
    login: string;
    loading: boolean;
}

const SignupPage: FC = () => {
    const [values, setValues] = useState<IState>({
        showPassword: false,
        password: "",
        email: "",
        warnings: [],
        name: "",
        login: "",
        loading: false
    })
    const navigate = useNavigate();
    const theme = useTheme();

    const signUp = async () => {
        setValues({...values, loading: true})
        await register(values.login, values.password, values.email, values.name).then(resp => {
            console.log("register", resp)
                if (resp.status === 201) {
                    navigate(ACTIVATE_ACCOUNT_INFO + values.email);
                }
            }
        ).catch(({response}) => {
            console.log("register err", response)
            switch (response.status) {
                case 403:
                    console.log(response.data.message);
                    values.warnings = [response.data.message]
                    break;
                case 422:
                    console.log(response.data.response.message);
                    values.warnings = response.data.response.message
                    break;
                default:
                    values.warnings = ["Unknown error happened, please try later"]
            }
        }).finally(() => setValues({...values, loading: false}))
    }

    return <div className={loginPage}>
        <div className={flexr}>
            <LogoHomeNet style={{color: theme.palette.text.primary}}/>
            <Typography variant="h1" sx={{ml: 2, mt: 2}}>Sign up</Typography>
        </div>
        <br/>

        <TextField
            sx={{width: "100%"}}
            id="login-input-field"
            label="Login"
            value={values.login}
            onChange={e => setValues ({...values, login: e.target.value})}
        /><br/><br/>

        <TextField
            sx={{width: "100%"}}
            id="name-input-field"
            label="Full name"
            value={values.name}
            onChange={e => setValues ({...values, name: e.target.value})}
        /><br/><br/>

        <TextField
            sx={{width: "100%"}}
            id="email-input-field"
            label="Email"
            value={values.email}
            onChange={e => setValues ({...values, email: e.target.value})}
        /><br/><br/>

        <FormControl sx={{width: '100%'}} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
                id="outlined-adornment-password"
                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={e => setValues ({...values, password: e.target.value})}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={e => setValues ({...values, showPassword: !values.showPassword})}
                            edge="end"
                        >
                            {values.showPassword
                                ? <VisibilityOff color="secondary"/>
                                : <Visibility color="secondary"/>}
                        </IconButton>
                    </InputAdornment>
                }
                label="Password"
            />
        </FormControl>

        {values.warnings.length ? (
            <div className={warnContainer}>
                <div className={warnLabel}>Please check warnings:</div>
                {values.warnings.map (warning => {
                    return <div className={warnLabel}>- {warning};</div>
                })}
            </div>
        ) : <div><br/><br/></div>
        }

        <LoadingButton variant={"contained"}
                onClick={() => signUp ()}
                className={[btn].join (' ')}
                loading={values.loading}
                fullWidth
        >
            SIGN UP
        </LoadingButton><br/>

        <div className={delimiter}/><br/>
            <div className={[cntrContent].join(' ')}>
                <Typography variant="h6" sx={{mr: 1, mt: .2}}>Already a user?</Typography>
                <Link
                    underline="hover"
                    color="info"
                    className={[imgHover, colBlue].join(' ')}
                    onClick={() => navigate (LOGIN_PAGE)}
                > LOGIN </Link>
            </div>
        </div>
}

export default SignupPage;