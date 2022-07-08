import React, {FC, useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {delimiter, loginPage, stickCntr, warnContainer} from "../styles/Login.css";
import {mainLabel, point, preLabel, warnLabel} from "../styles/common/labels.css";
import {hFont, underline} from "../styles/common/fonts.css";
import {btn, wideMuiBtn} from "../styles/common/buttons.css";
import {NavLink} from "react-router-dom";
import {HOME_PAGE, LOGIN_PAGE} from "../utils/consts";
import {register} from "../web/http/auth";
import {UserAuthContext} from "../globals/UserAuthProvider";
import {flexr, floatr, wide} from "../styles/common/position.css";
import {Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import logoHomeNet from "../assets/home-net-black.svg";
import logoAddDev from "../assets/add-device2.svg";
import {MODAL_TYPE} from "./modals/ModalProvider";

interface IState {
    showPassword: boolean;
    password: string;
    email: string;
    warnings: Array<string>;
    name: string;
}

const SignupPage: FC = () => {
    const [values, setValues] = useState<IState>({
        showPassword: false,
        password: "",
        email: "",
        warnings: [],
        name: ""
    })
    const navigate = useNavigate();
    const {setAuthData} = useContext(UserAuthContext);

    const signUp = async () => {
        await register(values.email, values.password, values.name).then(data => {
                console.log("signed up, data: ", data);
                setAuthData(data.data.token);
                navigate(HOME_PAGE);
            }
        ).catch(({response}) => {
            switch (response.status) {
                case 403:
                    console.log(response.data.message);
                    setValues({...values, warnings: response.data.message})
                    break;
                case 422:
                    console.log(response.data.response.message);
                    setValues({...values, warnings: response.data.response.message})
                    break;
                default:
                    setValues({...values, warnings: ["Unknown error happened"]})
            }
        });
    }

    return (
        <div className={loginPage}>
            <div className={flexr}>
                <img src={logoHomeNet} alt={"HomeNet logo"}/>
                <p className={[hFont].join(' ')}>&nbsp;Sign up</p>
            </div><br/>

            <TextField
                sx={{width: "100%"}}
                id="name-input-field"
                label="Username"
                value={values.name}
                onChange={e => setValues({...values, name: e.target.value})}
            /><br/><br/>

            <TextField
                sx={{width: "100%"}}
                id="email-input-field"
                label="Email"
                value={values.email}
                onChange={e => setValues({...values, email: e.target.value})}
            /><br/><br/>

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
                />
            </FormControl>

            {values.warnings.length ? (
                <div className={warnContainer}>
                    <div className={warnLabel}>Please check warnings:</div>
                    {values.warnings.map(warning => {
                        return <div className={warnLabel}>- {warning};</div>
                    })}
                </div>
                ): <div><br/><br/></div>
            }

            <Button variant={"contained"}
                    onClick={() => signUp()}
                    className={[wide, btn].join(' ')}
            >
                SIGN UP
            </Button><br/>

            <div className={delimiter} />
            <div>
                <label className={[point, stickCntr, preLabel, underline].join(' ')}>
                    <NavLink to={LOGIN_PAGE}>
                        Already a user? LOGIN
                    </NavLink>
                </label>
            </div>
        </div>
    )
}

export default SignupPage;