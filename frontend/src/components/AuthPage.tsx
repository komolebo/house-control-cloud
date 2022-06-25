import {FC, useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {delimiter, fieldIcon, loginPage, pwdHide, pwdShow, stickCntr, warnContainer} from "../styles/Login.css";
import {mainLabel, point, preLabel, warnLabel} from "../styles/common/labels.css";
import {bold, hFont, underline} from "../styles/common/fonts.css";
import {inputBox} from "../styles/common/inputs.css";
import {btn} from "../styles/common/buttons.css";
import {NavLink} from "react-router-dom";
import {HOME_PAGE, LOGIN_PAGE} from "../utils/consts";
import {register} from "../http/auth";
import {UserSettingContext} from "../globals/UserGlobals";
import {wide} from "../styles/common/position.css";


const AuthPage: FC = () => {
    const [pwdVisible, SetPwdVisible] = useState(false);
    const [pwdWarnings, setPwdWarnings] = useState<Array<string>>([]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {setIsAuth} = useContext(UserSettingContext);
    const navigate = useNavigate();

    const signUp = async () => {
        await register(email, password).then(data => {
                console.log("signed up, data: ", data);
                setIsAuth(true);
                navigate(HOME_PAGE);
            }
        ).catch(({response}) => {
            switch (response.status) {
                case 403:
                    console.log(response.data.message);
                    setPwdWarnings([response.data.message]);
                    break;
                case 422:
                    console.log(response.data.response.message);
                    setPwdWarnings(response.data.response.message);
                    break;
                default:
                    setPwdWarnings(["Unknown error happened"]);
            }
        });
    }

    return (
        <div className={loginPage}>
            <p className={[mainLabel, hFont].join(' ')}>SIGN UP</p>

            <div>
                <label className={[preLabel, bold].join(' ')}>Email</label>
                <input className={[inputBox].join(' ')} type="text"
                       onChange={e => setEmail(e.target.value)}
                />
            </div>
            <br />
            <div>
                <label className={[preLabel, bold].join(' ')}>Password</label>
                <input className={inputBox} type={pwdVisible ? "text" : "password"}
                       onChange={e => setPassword(e.target.value)}
                       required
                />
                <span className={[fieldIcon, point, pwdVisible ? pwdHide : pwdShow].join(' ')}
                      onClick={() => {SetPwdVisible(!pwdVisible)}}
                />
            </div>

            {pwdWarnings.length ? (
                <div className={warnContainer}>
                    <div className={warnLabel}>Please check warnings:</div>
                    {pwdWarnings.map(warning => {
                        return <div className={warnLabel}>- {warning};</div>
                    })}
                </div>
                ): <div><br/><br/></div>
            }

            <button className={[wide, btn].join(' ')} onClick={() => signUp()}>
                SIGN UP
            </button>

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