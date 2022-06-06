import {FC, useState} from "react";
import {delimiter, fieldIcon, loginPage, pwdHide, pwdShow, stickCntr, stickRight} from "../styles/Login.css";
import {freeLabel, mainLabel, point, preLabel} from "../styles/common/labels.css";
import {bold, headFont, underline} from "../styles/common/fonts.css";
import {inputBox} from "../styles/common/inputs.css";
import {wideBtn} from "../styles/common/buttons.css";
import {NavLink} from "react-router-dom";
import {AUTH_PAGE, LOGIN_PAGE} from "../utils/consts";

const LoginPage: FC = () => {
    const [pwdVisible, SetPwdVisible] = useState(false);

    return (
        <div className={loginPage}>
            <p className={[mainLabel, headFont].join(' ')}>LOGIN</p>

            <div>
                <label className={[preLabel, bold].join(' ')}>Email</label>
                <input className={inputBox} type="text"/>
            </div>
            <br />
            <div>
                <label className={[preLabel, bold].join(' ')}>Password</label>
                <input className={inputBox} type={pwdVisible ? "text" : "password"} required/>
                <span className={[fieldIcon, point, pwdVisible ? pwdShow : pwdHide].join(' ')}
                      onClick={() => {SetPwdVisible(!pwdVisible)}}
                />
            </div>

            <div className={freeLabel}>
                <input type="checkbox" name="remember"/>
                <label> Remember me? </label>
            </div>

            <button className={wideBtn} >LOGIN</button>

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