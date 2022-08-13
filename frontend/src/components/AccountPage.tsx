import React, {FC, useContext, useEffect, useState} from "react";
import {
    casket,
    commonPage, leftCasket, rightCasket,
    simpleCasket,
    simpleCasketRo,
    simpleCasketTr
} from '../styles/common/pages.css'
import {h5Font, helpText} from "../styles/common/fonts.css";
import {NavSeq} from "./NavSeq";
import {ACCOUNT_PAGE} from "../utils/consts";
import {shorterMuiBtn, shortMuiBtn, wideMuiBtn} from "../styles/common/buttons.css";
import {Avatar, Button, Card, FormControlLabel, IconButton, Switch, TextField, Typography} from "@mui/material";
import {cntrVContent, floatr} from "../styles/common/position.css";
import logoEdit from "../assets/edit-device.svg";
import logoVerified from "../assets/verified.svg";
import logoUncollapse from "../assets/uncollapse.svg";
import logoCollapse from "../assets/collapse.svg";
import logoMinus from "../assets/blue-minus2.svg";
import {spaceNoPad, spaceTextEdit} from "../styles/common/spaces.css";
import {TBlItem, TUPref, TUser} from "../globals/AccountData";
import {colBlue, darkBoxBg, lightBoxBg} from "../styles/common/colors.css";
import logoDelete from "../assets/delete-account.svg";
import {UserGlobalContext} from "../globals/UserAuthProvider";
import {
    nestGetBlackList,
    nestGetUserFullInfo,
    nestPatchUpdateUserInfo,
    nestPostRemoveAvatar,
    postUnblockUser,
    nestPatchUserPref
} from "../http/rqData";
import {MODAL_TYPE, useGlobalModalContext} from "./modals/ModalProvider";
import {LoadingButton} from "@mui/lab";
import PhoneInputComponent, {DEFAULT_COUNTRY_CODE} from "./elements/PhoneInputComponent";
import {DarkModeContext} from "../globals/DarkModeProvider";

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
    const {avatarSrc, setAvatarSrc, updateUserInfo, userInfo} = useContext(UserGlobalContext);
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
    const handleRemoveAvatar = () => {
        setState({...state, loadingRemoval: true})
        userInfo && nestPostRemoveAvatar(userInfo.id).then(res => {
            console.log(res);
            setAvatarSrc("");
            onChange();
            setState({...state, loadingRemoval: false})
        })
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

    return <div className={casket}>
        <div className={cntrVContent}>
            <div style={{textAlign: "center"}}>
                <Avatar
                    sx={{
                        // m: "15px 5px",
                        width: 100, height: 100,
                        m: "10px 0 15px 0",
                        border: "2px solid #1690E9"
                    }}
                    src={avatarSrc}
                />
                <Typography variant="h3">{user.login}</Typography>
            </div>

            <Button
                onClick={() => showModal(MODAL_TYPE.ChooseAvatarModal, {
                    onClose: () => hideModal(),
                    onAct: (data) => handleUpdateAvatar(data),
                    data: { curAvatarSrc: avatarSrc }
                })}
                variant="outlined"
                color="info"
                sx={{ ml: 1 }}
                className={[shortMuiBtn].join(' ')}
            >
                Upload
            </Button>

            <LoadingButton
                endIcon={<></>}
                onClick={() => handleRemoveAvatar()}
                color="secondary"
                variant="outlined" sx={{ ml: 2 }}
                className={[shortMuiBtn].join(' ')}
                loading={state.loadingRemoval}
                loadingPosition="end"
            >
                Remove
            </LoadingButton>
        </div><br/><br/>

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
                <div className={[colBlue, h5Font].join(' ')}>&nbsp; Verified &nbsp;
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
        postUnblockUser(blackList[i].id).then(res => {
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
        <br/>
        { unwrap ?
            <table className={[simpleCasket, boxClassName].join(' ')}>
                <tbody>
                {
                    blackList.map((blEl, i) => {
                        return <tr key={i} className={simpleCasketTr}>
                                <td className={[floatr, cntrVContent, simpleCasketRo].join(' ')}>
                                    <IconButton onClick={ () => handleUnblockUser(i) }>
                                        <img src={logoMinus} alt={"Minus user"}/>
                                    </IconButton>
                                </td>
                                <td className={[cntrVContent, simpleCasketRo].join(' ')}>
                                        <Avatar alt="Remy Sharp" src={blEl.urlPic}
                                                style={{width: 40, height: 40, marginRight: 10, border: "2px solid #1690E9"}} />
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
        <div className={helpText}>Here you can view device actions history or your activity</div><br/>

        <NavSeq currentPage={ACCOUNT_PAGE}/><br/>

        <div style={{gap: 20, display: "flex"}}>
            <div className={[leftCasket].join(' ')}>
                <Card>
                    <AccountDataElementL user={state.user} onChange={() => syncAllData()}/>
                </Card>
            </div>
            <Card className={[rightCasket].join(' ')}>
                <AccountDataElementR user={state.user} onChange={() => syncAllData()} blackList={state.blackList}/>
            </Card>
        </div>
    </div>
}