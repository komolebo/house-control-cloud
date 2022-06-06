import {FC, useState} from "react";
import {delimiter, fieldIcon, loginPage, pwdHide, pwdShow, stickCntr} from "../styles/Login.css";
import {mainLabel, point, preLabel} from "../styles/common/labels.css";
import {bold, headFont, underline} from "../styles/common/fonts.css";
import {inputBox, inputBoxError} from "../styles/common/inputs.css";
import {wideBtn} from "../styles/common/buttons.css";
import {NavLink} from "react-router-dom";
import {LOGIN_PAGE} from "../utils/consts";


const AuthPage: FC = () => {
    const [pwdVisible, SetPwdVisible] = useState(false);
    const [pwdInvalid, setPwdInvalid] = useState(false);

    return (
        <div className={loginPage}>
            <p className={[mainLabel, headFont].join(' ')}>SIGN UP</p>

            <div>
                <label className={[preLabel, bold].join(' ')}>Email</label>
                <input className={[inputBox, pwdInvalid ? inputBoxError : ''].join(' ')} type="text"/>
            </div>
            <br />
            <div>
                <label className={[preLabel, bold].join(' ')}>Password</label>
                <input className={inputBox} type={pwdVisible ? "text" : "password"} required/>
                <span className={[fieldIcon, point, pwdVisible ? pwdHide : pwdShow].join(' ')}
                      onClick={() => {SetPwdVisible(!pwdVisible)}}
                />
            </div>

            <br/><br/>

            <button className={wideBtn}>SIGN UP</button>

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

export default AuthPage;