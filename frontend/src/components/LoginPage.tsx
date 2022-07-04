import React, {FC, useContext, useRef, useState} from "react";
import {
    delimiter,
    fieldIcon,
    loginPage,
    pwdHide,
    pwdShow,
    stickCntr,
    stickRight
} from "../styles/Login.css";
import {freeLabel, mainLabel, point, preLabel, warnLabel} from "../styles/common/labels.css";
import {bold, hFont, underline} from "../styles/common/fonts.css";
import {inputBox} from "../styles/common/inputs.css";
import {btn} from "../styles/common/buttons.css";
import {NavLink, useNavigate} from "react-router-dom";
import {AUTH_PAGE, HOME_PAGE} from "../utils/consts";
import {login} from "../http/auth";
import {wide} from "../styles/common/position.css";
import {UserAuthContext} from "../globals/UserAuthProvider";


const LoginPage: FC = () => {
    const [pwdVisible, SetPwdVisible] = useState(false);
    const [credWarning, setCredWarning] = useState<string>("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const pwdFocusRef = useRef<any>();
    const navigate = useNavigate();
    const {setAuthData} = useContext(UserAuthContext);

    const signIn = () => {

        login(email, password).then(
            ({data}) => {
                switch (data.status) {
                    case 401:
                        setCredWarning("Wrong email or password")
                        break;
                    case 202:
                        setCredWarning("");
                        setAuthData(data.token);
                        navigate(HOME_PAGE);
                        break;
                }
                console.log("good: ", data);
            }
        ).catch(({response}) => {
            switch (response.status) {
                case 422:
                    setCredWarning("Email or password is invalid")
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
            <p className={[mainLabel, hFont].join(' ')}>LOGIN</p>

            <div>
                <label className={[preLabel, bold].join(' ')}>Email</label>
                <input className={inputBox} type="text"
                       onChange={e => setEmail(e.target.value)}
                       onKeyUp={e => handleKeyUp(e, false)}
                />
            </div>
            <br />
            <div>
                <label className={[preLabel, bold].join(' ')}>Password</label>
                <input className={inputBox} type={pwdVisible ? "text" : "password"}
                       onChange={e => setPassword(e.target.value)}
                       ref={pwdFocusRef}
                       onKeyUp={e => handleKeyUp(e, true)}
                       required/>
                <span className={[fieldIcon, point, pwdVisible ? pwdShow : pwdHide].join(' ')}
                      onClick={() => {SetPwdVisible(!pwdVisible)}}
                />
            </div>

            <div className={freeLabel}>
                <input type="checkbox" name="remember"/>
                <label> Remember me? </label>
            </div>

            {credWarning.length ? (
                <div className={[warnLabel].join(' ')}>{credWarning}</div>
            ): <div/>
            }

            <br/>
            <button className={[btn, wide].join(' ')}
                    onClick={signIn}
                >
                LOGIN
            </button>

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