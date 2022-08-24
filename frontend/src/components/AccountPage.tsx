import React, {FC, useContext, useEffect, useState} from "react";
import {
    casket,
    commonPage, leftCasket, rightCasket,
    simpleCasket,
    simpleCasketRo,
    simpleCasketTr
} from '../styles/common/pages.css'
import {helpText} from "../styles/common/fonts.css";
import {NavSeq} from "./NavSeq";
import {ACCOUNT_PAGE} from "../utils/consts";
import {shorterMuiBtn, wideMuiBtn} from "../styles/common/buttons.css";
import {Avatar, Button, Card, FormControlLabel, IconButton, Switch, TextField, Typography} from "@mui/material";
import {cntrVContent, flexr, floatr} from "../styles/common/position.css";
import logoEdit from "../assets/edit-device.svg";
import logoVerified from "../assets/verified.svg";
import logoUncollapse from "../assets/uncollapse.svg";
import logoCollapse from "../assets/collapse.svg";
import {ReactComponent as LogoMinus} from "../assets/filled-minus.svg";
import {spaceNoPad, spaceTextEdit} from "../styles/common/spaces.css";
import {TBlItem, TUPref, TUser} from "../globals/AccountData";
import {colBlue, darkBoxBg, lightBoxBg} from "../styles/common/colors.css";
import logoDelete from "../assets/delete-account.svg";
import {UserGlobalContext} from "../globals/providers/UserAuthProvider";
import {
    nestGetBlackList,
    nestGetUserFullInfo,
    nestPatchUpdateUserInfo,
    nestDeleteUnblockUser,
    nestPatchUserPref
} from "../http/rqData";
import {MODAL_TYPE, useGlobalModalContext} from "./modals/ModalProvider";
import PhoneInputComponent, {DEFAULT_COUNTRY_CODE} from "./elements/PhoneInputComponent";
import {DarkModeContext} from "../globals/providers/DarkModeProvider";
import logoAvaEdit from "../assets/ava-edit.svg";

interface IState {
    user: TUser,
    blackList: Array<TBlItem>
}
interface IBaseInfoState {
    loadingRemoval: boolean,
    editMode: boolean,
    name: string,
    email: string,
    phone: string,
    warningName: string;
    warningEmail: string;
    warningPhone: string;
}
interface IPropBaseInfo {
    user: TUser,
    onChange: () => void
}
interface IPropExtraInfo {
    user: TUser,
    onChange: () => void,
    blackList: Array<TBlItem>
}
const initialState: IState = {
    user: {...{} as TUser, preference: {} as TUPref},
    blackList: []
}
const initialBaseInfoState: IBaseInfoState = {
    loadingRemoval: false,
    editMode: false,
    email: "",
    name: "",
    phone: "",
    warningName: "",
    warningEmail: "",
    warningPhone: "",
}

const AccountDataElementL: FC<IPropBaseInfo> = ({user, onChange}) => {
    const {avatarSrc, setAvatarSrc, updateUserInfo} = useContext(UserGlobalContext);
    const {showModal, hideModal} = useGlobalModalContext();
    let [state, setState] = useState<IBaseInfoState>(initialBaseInfoState)

    useEffect(() => {
        function handleEscapeKey(event: KeyboardEvent) {
            if (event.code === 'Escape') {
                setState({...state, editMode: false})
            }
        }

        document.addEventListener('keyup', handleEscapeKey)
        return () => document.removeEventListener('keyup', handleEscapeKey)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        clearInput()
        initView()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    const initView = () => {
        setState({...state})
    }
    const handleUpdateAvatar = (newAvaSrc: string) => {
        setAvatarSrc(newAvaSrc);
        onChange();
    }
    const isDataEdited = () => {
        return user.full_name !== state.name || user.email !== state.email ||
            (user.phone !== state.phone && state.phone !== DEFAULT_COUNTRY_CODE)
    }
    const clearInput = () => {
        state.name = user.full_name;
        state.email = user.email;
        state.phone = user.phone ? user.phone : DEFAULT_COUNTRY_CODE
        state.warningEmail = state.warningName = state.warningPhone = ""
    }
    const verifyName = (name: string) => {
        if (!name.length) {
            state.warningName = "Name cannot be empty"
            return false;
        }
        return true;
    }
    const verifyEmail = (email: string) => {
        if (!email.length) {
            state.warningEmail = "Email cannot be empty"
            return false;
        }

        const formatOk = email.match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
        if (!formatOk) {
            state.warningEmail = "Incorrect email format"
            return false;
        }
        return true;
    }
    const verifyPhone = (phone: string) => {
        if (phone.length !== 12) {
            state.warningPhone = "Incorrect phone number format"
            return false;
        }
        return true
    }
    const handleSave = () => {
        const changedUserFields: { [key: string] : string } = {}
        state.warningPhone = state.warningName = state.warningEmail = ""
        let validateOk = true;
        if (state.name !== user.full_name) {
            if (verifyName(state.name)) {
                changedUserFields["full_name"] = state.name
            } else { validateOk = false; }
        }
        if (state.email !== user.email) {
            if (verifyEmail(state.email)) {
                changedUserFields["email"] = state.email
            } else { validateOk = false; }
        }
        if (state.phone !== user.phone && state.phone !== DEFAULT_COUNTRY_CODE) {
            if (verifyPhone(state.phone)) {
                changedUserFields["phone"] = state.phone
            } else { validateOk = false; }
        }
        initView()

        if(validateOk && Object.keys(changedUserFields).length) {
            nestPatchUpdateUserInfo(user.id, changedUserFields).then(resp => {
                if (resp.status === 200 || resp.status === 201) {
                    setState({...state, editMode: false})
                    updateUserInfo(changedUserFields)
                    onChange();
                }
            })
        }
    }
    const handleEditAvatar = () => {
        showModal(MODAL_TYPE.ChooseAvatarModal, {
            onClose: () => hideModal(),
            onAct: (data) => handleUpdateAvatar(data),
            data: { curAvatarSrc: avatarSrc }
        })
    }

    return <div className={casket}>
        <div className={cntrVContent}>

            <div style={{textAlign: "center", position: "relative"}}>
                <IconButton onClick={handleEditAvatar} sx={{p: 0}}>
                    <Avatar
                        sx={{
                            m: "10px 0 15px 0",
                            border: "2px solid #1690E9"
                        }}
                        src={avatarSrc}
                        onClick={handleEditAvatar}
                    />
                    <img
                        src={logoAvaEdit}
                        style={{position: "absolute", right: 10, top: 10}}
                        alt={"edit"}
                        onClick={handleEditAvatar}
                    />
                </IconButton>
                <Typography variant="h3">{user.login}</Typography>
            </div>
        </div><br/>

        {state.editMode
            ? <Button
                    variant="text"
                    color="info"
                    onClick={() => {clearInput(); setState({...state, editMode: false})}}
                    sx={{
                        right: 0, top: 10, position:'absolute',
                    }}
                    className={shorterMuiBtn}
            > Cancel
            </Button>
            : <Button
                    variant="text"
                    size="large"
                    color="info"
                    onClick={() => setState({...state, editMode: true})}
                    sx={{
                        right: 0, top: 10, position:'absolute',
                    }}
                    endIcon={<img src={logoEdit} alt={"Logo edit"}/>}
                    className={shorterMuiBtn}
            > Edit
            </Button>
        }

        {/* start elements */}
        <div style={{paddingBottom: 20, gap: 20, display: "flex"}} >
            <div style={{width: "47%"}}>
                <Typography variant="h4">Name</Typography>
                {state.editMode
                    ? <div className={[spaceNoPad].join (' ')} >
                        <TextField
                            error={state.warningName.length > 0}
                            helperText={state.warningName}
                            defaultValue={user.full_name}
                            fullWidth={true}
                            onChange={e => setState({...state, name: e.target.value})}
                            size="small"
                            variant="outlined"
                            color="info"
                            onKeyPress={e => e.key === 'Enter' && handleSave()}
                            className="border"
                        />
                    </div>
                    : <Typography
                        className={[spaceTextEdit].join (' ')} variant="h3">{user.full_name}
                    </Typography>
                }
            </div>
        </div>

        <div style={{paddingBottom: 20, gap: 20, display: "flex"}}>
            <div style={{width: "47%"}}>
                <Typography variant="h4">Email</Typography>
                {state.editMode
                    ? <div className={[spaceNoPad].join (' ')}>
                        <TextField
                            error={state.warningEmail.length > 0}
                            helperText={state.warningEmail}
                            defaultValue={user.email}
                            onChange={e => setState({...state, email: e.target.value.toLowerCase()})}
                            fullWidth={true}
                            size="small"
                            variant="outlined"
                            color="info"
                            onKeyPress={e => e.key === 'Enter' && handleSave()}
                        />
                    </div>
                    : <Typography
                        className={[spaceTextEdit].join (' ')} variant="h3">{user.email}
                    </Typography>
                }
                <div className={[flexr].join(' ')}>
                    <Typography
                        variant="h5" sx={{ml: 1, mr: 1}}
                        className={colBlue}
                    >Verified</Typography>
                    <img src={logoVerified} alt="logo verified"/>
                </div>
            </div>

            { state.editMode
                ? <div style={{width: "47%"}}>
                    <Typography variant="h4">Phone</Typography>
                    <div className={[spaceNoPad].join (' ')}>
                        <TextField
                            error={state.warningPhone.length > 0}
                            helperText={state.warningPhone}
                            // onChange={e => setState({...state, phone: e.target.value})}
                            value={state.phone}
                            variant="outlined"
                            color="info"
                            size="small"
                            fullWidth={true}
                            onKeyPress={e => e.key === 'Enter' && handleSave()}
                            InputProps={{
                                inputComponent: PhoneInputComponent,
                                // autoFocus: true,
                                onChange: e => setState({...state, phone: e.target.value.replace(/[^\d]/g, '')}),
                            }}
                        />
                    </div>
                    <Button style={{height: 24 }} >
                        Verify
                    </Button>
                </div>
                : user.phone
                    ? <div style={{width: "47%"}}>
                        <Typography variant="h4">Phone</Typography>
                        <div className={[spaceTextEdit].join (' ')}>
                            <Typography variant="h3">{user.phone}</Typography>
                        </div>
                        <Button style={{height: 24 }} >
                            Verify
                        </Button>
                    </div>
                    : <></>
            }
        </div>

        <br/>
        <Typography variant="h4">Delete account</Typography>

        <div className={helpText}>You automatically will be removed from connected to you devices</div>
        <Button variant={"text"}
                color={"error"}
                endIcon={ <img src={logoDelete} alt={"Logo delete account"}/> }
                onClick={() => showModal(MODAL_TYPE.DeleteAccountModal, {
                    onClose: () => hideModal(),
                    onAct: () => {},
                    data: user
                })}
        >
            Delete
        </Button>

        <br/>

        {state.editMode
            ? <div><br/>
                <Button variant={"contained"}
                        color="info"
                    // sx={{ mt: 2,}}
                        disabled={!isDataEdited()}
                        onClick={handleSave}
                        className={wideMuiBtn}
                > Save </Button>
            </div>
            : <></>
        }
    </div>
}

const AccountDataElementR: FC<IPropExtraInfo> = ({user, onChange, blackList}) => {
    const [unwrap, setUnwrap] = useState(false);
    const {globalDark, setGlobalDark} = useContext(DarkModeContext);

    const handleUnblockUser = (i: number) => {
        if (!user.preference || !blackList) return;
        nestDeleteUnblockUser(user.id, blackList[i].id).then(res => {
            console.log(res.status)
            if (res.status) {
                onChange();
            }
        })
    }
    const handleDarkModeChange = (e: any) => {
        const darkMode = e.target.checked;
        nestPatchUserPref(user.id, {
            dark_mode: darkMode
        }).then(res => {
            if (res.status === 200) {
                setGlobalDark(darkMode)
                onChange();
            }
        })
    }

    const boxClassName = globalDark ? darkBoxBg : lightBoxBg;
    return <div className={casket}>
        <div style={{display: "flex", justifyContent: "flex-end"}}>
            <FormControlLabel
                control={
                    <Switch checked={globalDark}
                            onChange={handleDarkModeChange}
                            color="info"
                    />}
                label="Dark mode"
            />
        </div><br/>

        <IconButton className={floatr}
            // style={{padding: 0, paddingLeft: 10}}
                    onClick={() => setUnwrap(!unwrap)} >
            <img src={unwrap ? logoCollapse : logoUncollapse} alt={"Collapse logo"}/>
        </IconButton>
        <Typography variant="h4">Block list</Typography>
        <div className={helpText}>{blackList.length} blocked users are forbidden to send you notification</div>
        <div className={helpText}>They won't be able to get your approval</div>
        <br/>
        { unwrap ?
            <table className={[simpleCasket, boxClassName].join(' ')}>
                <tbody>
                {
                    blackList.map((blEl, i) => {
                        return <tr key={i} className={simpleCasketTr}>
                                <td className={[floatr, cntrVContent, simpleCasketRo].join(' ')}>
                                    <IconButton onClick={ () => handleUnblockUser(i) }>
                                        <LogoMinus fill="#1690E9"/>
                                    </IconButton>
                                </td>
                                <td className={[cntrVContent, simpleCasketRo].join(' ')}>
                                        <Avatar alt="Remy Sharp" src={blEl.urlPic}
                                                style={{width: 40, height: 40, marginRight: 10, border: "2px solid #1690E9"}}
                                        />
                                    <Typography variant="h3">{blEl.login}</Typography>

                                    {/*{blEl.login}*/}
                                </td>
                            </tr>
                    })
                }
                </tbody>
            </table>
            : <></>
        }
    </div>
}

export const AccountPage: FC = () => {
    const [state, setState] = useState<IState>(initialState)
    const {userInfo} = useContext(UserGlobalContext);

    const initView = () => {
        setState({...state})
    }
    const syncBlackListOnly = () => {
        userInfo && nestGetBlackList(userInfo.id).then(resp => {
            if (resp.status === 200 || resp.status === 201) {
                state.blackList = resp.data
                initView();
            }
        })
    }
    const syncAllData = () => {
        userInfo && nestGetUserFullInfo(userInfo.id).then(resp => {
            if (resp.status === 200 || resp.status === 201) {
                state.user = resp.data
                syncBlackListOnly();
            }
        })
    }

    useEffect(() => {
        syncAllData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div className={commonPage}>
        <Typography variant="h1">
            Account
        </Typography>
        <Typography variant="h6" sx={{mb: 3, mt: 1}}>Here you can view device actions history or your activity</Typography>

        <NavSeq currentPage={ACCOUNT_PAGE}/><br/>

        <div style={{gap: 20, display: "flex"}}>
            <div className={[leftCasket].join(' ')}>
                <Card className="blur">
                    <AccountDataElementL user={state.user} onChange={() => syncAllData()}/>
                </Card>
            </div>
            <Card className={[rightCasket, "blur"].join(' ')}>
                <AccountDataElementR user={state.user} onChange={() => syncAllData()} blackList={state.blackList}/>
            </Card>
        </div>
    </div>
}