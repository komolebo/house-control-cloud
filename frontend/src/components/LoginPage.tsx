import {FC, useContext, useState} from "react";
import {
    delimiter,
    fieldIcon,
    loginPage,
    pwdHide,
    pwdShow,
    stickCntr,
    stickRight,
    warnContainer
} from "../styles/Login.css";
import {freeLabel, mainLabel, point, preLabel, warnLabel} from "../styles/common/labels.css";
import {bold, headFont, underline} from "../styles/common/fonts.css";
import {inputBox} from "../styles/common/inputs.css";
import {wideBtn} from "../styles/common/buttons.css";
import {NavLink, useNavigate} from "react-router-dom";
import {AUTH_PAGE, HOME_PAGE, LOGIN_PAGE} from "../utils/consts";
import {UserSettingContext} from "../globals/UserGlobals";
import {login, register} from "../http/auth";

const LoginPage: FC = () => {
    const [pwdVisible, SetPwdVisible] = useState(false);
    const [credentialsValid, setCredentialsValid] = useState(true);
    const [credWarning, setCredWarning] = useState<string>("");
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let {isAuth, setIsAuth} = useContext(UserSettingContext);

    let navigate = useNavigate();

    const signIn = async () => {
        await login(email, password).then(
            ({data}) => {
                switch (data.status) {
                    case 401:
                        setCredentialsValid(false);
                        setCredWarning("Wrong email or password")
                        break;
                    case 202:
                        setCredWarning("");
                        setIsAuth(true);
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
            // const data = response['data']['response']['message']
            // setWarnings(data);
            // console.log("error: ", response, "data: ", data)
            setCredentialsValid(false);
        });
    }

    return (
        <div className={loginPage}>
            <p className={[mainLabel, headFont].join(' ')}>LOGIN</p>

            <div>
                <label className={[preLabel, bold].join(' ')}>Email</label>
                <input className={inputBox} type="text"
                       onChange={e => setEmail(e.target.value)}
                />
            </div>
            <br />
            <div>
                <label className={[preLabel, bold].join(' ')}>Password</label>
                <input className={inputBox} type={pwdVisible ? "text" : "password"}
                       onChange={e => setPassword(e.target.value)}
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
            <button className={wideBtn}
                    onClick={() => signIn()}
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