import React, {FC, useRef, useState} from "react";
import {flexr} from "../../styles/common/position.css";
import logoHomeNet from "../../assets/home-net-black.svg";
import {h4Font, hFont} from "../../styles/common/fonts.css";
import {delimiter, loginPage, stickCntr} from "../../styles/Login.css";
import {Button, IconButton, InputAdornment, TextField} from "@mui/material";
import {btn} from "../../styles/common/buttons.css";
import {LOGIN_PAGE} from "../../utils/consts";
import {useNavigate} from "react-router-dom";
import {Visibility, VisibilityOff} from "@mui/icons-material";

interface IState {
    password: string;
    confirmPassword: string;
    errorPassword: string;
    errorConfirmPassword: string;
    showPassword: boolean;
    showConfirmPassword: boolean;
}
const initialState: IState = {
    password: "",
    confirmPassword: "",
    errorPassword: "",
    errorConfirmPassword: "",
    showPassword: false,
    showConfirmPassword: false
}

const MIN_PWD_CHAR = 8

export const CreatePwdPage: FC = () => {
    const [state, setState] = useState<IState>(initialState)
    const navigate = useNavigate();
    const confirmRef = useRef<any>();

    const checkPassword = () => {
        if (state.password.length < MIN_PWD_CHAR) {
            setState({...state,
                errorPassword: `Password should contain at least ${MIN_PWD_CHAR} letters`
            })
            return false;
        }
        if (state.password !== state.confirmPassword) {
            setState({...state,
                errorConfirmPassword: `Passwords do not match`
            })
            return false;
        }
        return true
    }
    const handleSavePassword = () => {
        if(checkPassword()) {

        }
    }
    const handleNewPwdInput = (e: any) => {
        setState({...state,
            password: e.target.value,
            errorPassword: ""
        })
    }
    const handleConfirmPwdInput = (e: any) => {
        setState({...state,
            confirmPassword: e.target.value,
            errorConfirmPassword: ""
        })
    }
    const handleKeyUp = (e: any) => {
        if (e.key !== 'Enter') return;

        if (e.target.id === "create-password-field") {
            confirmRef.current.focus()
        } else {
            handleSavePassword()
        }
    };

    return <div className={loginPage}>
        <div className={flexr}>
            <img src={logoHomeNet} alt={"HomeNet logo"}/>
            <p className={[hFont].join(' ')}>&nbsp;Create password</p>
        </div><br/>

        <div className={[h4Font, stickCntr].join(' ')}>
            Your new password must be different drom previously used password
        </div>
        <br/><br/>

        <TextField
            id="create-password-field"
            type={state.showPassword ? 'text' : 'password'}
            value={state.password}
            onChange={handleNewPwdInput}
            InputProps={{
                endAdornment:
                    <InputAdornment position="end">
                        <IconButton
                            onClick={e => setState({...state, showPassword: !state.showPassword})}
                            edge="end"
                        >
                            {state.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
            }}
            label="New password"
            error={state.errorPassword.length > 0}
            helperText={state.errorPassword}
            onKeyUp={handleKeyUp}
            autoFocus
            fullWidth
        />
        <br/><br/>

        <TextField
            id="create-password-field2"
            type={state.showConfirmPassword ? 'text' : 'password'}
            error={state.errorConfirmPassword.length > 0}
            label="Confirm password"
            value={state.confirmPassword}
            helperText={state.errorConfirmPassword}
            onChange={handleConfirmPwdInput}
            onKeyUp={handleKeyUp}
            fullWidth
            inputRef={confirmRef}
            InputProps={{
                endAdornment:
                    <InputAdornment position="end">
                        <IconButton
                            onClick={e => setState({...state, showConfirmPassword: !state.showConfirmPassword})}
                            edge="end"
                        >
                            {state.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
            }}
        />
        <br/><br/><br/>

        <Button variant={"contained"}
                onClick={() => handleSavePassword()}
                className={[btn].join(' ')}
                fullWidth
        >
            SAVE
        </Button>
        <br/>

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