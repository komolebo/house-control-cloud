import React, {FC, useContext, useEffect, useState} from "react";
import {commonCasket, commonPage, simpleCasket, simpleCasketRo, simpleCasketTr} from '../styles/common/pages.css'
import {h2Font, h3Font, h4Font, h5Font, helpText, hFont} from "../styles/common/fonts.css";
import {NavSeq} from "./NavSeq";
import {ACCOUNT_PAGE} from "../utils/consts";
import {shorterMuiBtn, shortMuiBtn, wideMuiBtn} from "../styles/common/buttons.css";
import {Avatar, Button, FormControlLabel, IconButton, Switch, TextField} from "@mui/material";
import {cntrVContent, flexG1, floatr} from "../styles/common/position.css";
import logoEdit from "../assets/edit-device.svg";
import logoVerified from "../assets/verified.svg";
import logoUncollapse from "../assets/uncollapse.svg";
import logoCollapse from "../assets/collapse.svg";
import logoMinus from "../assets/blue-minus2.svg";
import {spaceNoPad, spaceTextEdit} from "../styles/common/spaces.css";
import {TUPref, TUser} from "../globals/AccountData";
import {colBlue} from "../styles/common/colors.css";
import logoDelete from "../assets/delete-account.svg";
import {getUserInfo, UserGlobalContext} from "../globals/UserAuthProvider";
import {getPreferences, postRemoveAvatar, postUnblockUser, postUpdateUserPref} from "../http/rqData";
import {MODAL_TYPE, useGlobalModalContext} from "./modals/ModalProvider";
import {LoadingButton} from "@mui/lab";

let userInfo = getUserInfo();

interface IState {
    editMode: boolean;
    user: TUser;
    blockListUnwrap: boolean;
    loadingRemoval: boolean;
}
interface IPropUser {
    user: TUser,
    onChange: () => void
}

const curUser: TUser = {
    full_name: userInfo ? userInfo?.full_name : "",
    email: userInfo ? userInfo.email : "",
    phone: userInfo ? userInfo.phone : "No phone entered",
    login: userInfo ? userInfo.login : "",
    blockList: [],
    prefs: {} as TUPref
}

const initialState = {
    user: curUser,
    editMode: false,
    blockListUnwrap: false,
    loadingRemoval: false
}

const AccountDataElementL: FC<IPropUser> = ({user, onChange}) => {
    const {avatarSrc, setAvatarSrc} = useContext(UserGlobalContext);
    const { showModal, hideModal } = useGlobalModalContext();
    const [state, setState] = useState<IState>(initialState)

    const handleUpdateAvatar = (newAvaSrc: string) => {
        setAvatarSrc(newAvaSrc);
        onChange();
    }
    const handleRemoveAvatar = () => {
        setState({...state, loadingRemoval: true})
        postRemoveAvatar().then(res => {
            console.log(res);
            setAvatarSrc("");
            onChange();
            setState({...state, loadingRemoval: false})
        })
    }

    return <div className={[commonCasket, flexG1].join(' ')}>
        <div className={h2Font}>Avatar</div>

        <div className={cntrVContent}>
            <div style={{textAlign: "center"}}>
                {/*<img src={"/avatars/avatar1.svg"} alt={"Logo ava"}/>*/}
                <Avatar
                    sx={{
                        // m: "15px 5px",
                        width: 100, height: 100,
                        m: "10px 0 0 0",
                    }}
                    src={avatarSrc}
                />

                <div className={h4Font}>{user.login}</div>
            </div>

            <Button
                onClick={() => showModal(MODAL_TYPE.ChooseAvatarModal, {
                    onClose: () => hideModal(),
                    onAct: (data) => handleUpdateAvatar(data),
                    data: { curAvatarSrc: avatarSrc }
                })}
                variant={"outlined"} sx={{ ml: 1 }}
                className={[shortMuiBtn].join(' ')}
            >
                Update
            </Button>

            <LoadingButton
                endIcon={<></>}
                onClick={() => handleRemoveAvatar()}
                color={"inherit"}
                variant={"outlined"} sx={{ ml: 2 }}
                className={[shortMuiBtn].join(' ')}
                loading={state.loadingRemoval}
                loadingPosition="end"
            >
                Remove
            </LoadingButton>
        </div><br/><br/>

        {state.editMode
            ?
            <Button variant={"text"}
                    onClick={() => setState({...state, editMode: false})}
                    sx={{
                        right: 0, top: 10, position:'absolute',
                    }}
                    className={shorterMuiBtn}
            > Cancel
            </Button>
            :
            <Button variant={"text"}
                    size={"large"}
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
            {/*<div className={[h3Font].join (' ')} style={{width: "47%"}}> Login*/}
            {/*    <div className={[h4Font, spaceTextEdit].join (' ')}>{state.user.login}</div>*/}
            {/*</div>*/}

            <div className={[h3Font].join (' ')} style={{width: "47%"}}> Name
                {state.editMode
                    ? <div className={[spaceNoPad].join (' ')} >
                        <TextField
                            error={state.user.full_name.length === 0}
                            label={state.user.full_name.length === 0 ? "Name cannot be empty" : ""}
                            id="outlined-uncontrolled"
                            color={"info"}
                            defaultValue={user.full_name}
                            fullWidth={true}
                            onChange={e => setState ({...state, user: {...state.user, full_name: e.target.value}})}
                            size={"small"}
                        />
                    </div>
                    : <div className={[h4Font, spaceTextEdit].join (' ')}>{state.user.full_name}</div>
                }
            </div>
            {/*<br/>*/}
        </div>

        <div style={{paddingBottom: 20, gap: 20, display: "flex"}}>
            <div className={[h3Font].join (' ')}  style={{width: "47%"}}> Phone
                {state.editMode
                    ? <div className={[spaceNoPad].join (' ')}>
                        <TextField
                            error={state.user.phone.length === 0}
                            label={state.user.phone.length === 0 ? "Phone cannot be empty" : ""}
                            id="outlined-uncontrolled"
                            color={"info"}
                            defaultValue={state.user.phone}
                            fullWidth={true}
                            size={"small"}
                            onChange={e => setState ({...state, user: {...state.user, phone: e.target.value}})}
                        />
                    </div>
                    : <div className={[h4Font, spaceTextEdit].join (' ')}>{state.user.phone}</div>
                }
                <Button style={{height: 24 }} >
                    Verify
                </Button>
            </div>

            <div className={[h3Font].join (' ')}  style={{width: "47%"}}> Email
                {state.editMode
                    ? <div className={[spaceNoPad].join (' ')}>
                        <TextField
                            error={state.user.email.length === 0}
                            label={state.user.email.length === 0 ? "Email cannot be empty" : ""}
                            id="outlined-uncontrolled"
                            color={"info"}
                            defaultValue={user.email}
                            onChange={e => setState ({...state, user: {...state.user, email: e.target.value}})}
                            fullWidth={true}
                            size={"small"}
                        />
                    </div>
                    : <div className={[h4Font, spaceTextEdit].join (' ')}>{state.user.email}</div>
                }
                <div className={[colBlue, h5Font].join(' ')}>&nbsp; Verified &nbsp;
                    <img src={logoVerified} alt="logo verified"/>
                </div>
            </div>
        </div>

        <br/>
        <div className={[h3Font].join(' ')}>Delete account</div>
        <div className={helpText}>You automatically will be removed from connected to you devices</div>
        <Button variant={"text"}
                color={"error"}
                endIcon={ <img src={logoDelete} alt={"Logo delete account"}/> }
        >
            Delete
        </Button>

        <br/>

        {state.editMode
            ? <div><br/>
                <Button variant={"contained"}
                    // sx={{ mt: 2,}}
                    // disabled={name.length === 0}
                        onClick={() => {}}
                        className={wideMuiBtn}
                > Save </Button>
            </div>
            : <></>
        }
    </div>
}

const AccountDataElementR: FC<IPropUser> = ({user, onChange}) => {
    const [unwrap, setUnwrap] = useState(false);

    const handleUnblockUser = (i: number) => {
        postUnblockUser(user.blockList[i].id).then(res => {
            console.log(res.status)
            if (res.status) {
                onChange();
            }
        })
    }
    const handleDarkModeChange = (e: any) => {
        user.prefs.dark_mode = e.target.checked;
        postUpdateUserPref(user.prefs).then(res => {
            if (res.status === 201) {
                onChange();
            }
        })
    }

    return <div className={commonCasket}>
        <div style={{display: "flex", justifyContent: "flex-end"}}>
            <FormControlLabel
                control={
                    <Switch value={user.prefs.dark_mode}
                            onChange={handleDarkModeChange}
                    />}
                label="Dark mode"
            />
        </div><br/>

        <IconButton className={floatr}
            // style={{padding: 0, paddingLeft: 10}}
                    onClick={() => setUnwrap(!unwrap)} >
            <img src={unwrap ? logoCollapse : logoUncollapse} alt={"Collapse logo"}/>
        </IconButton>
        <div className={[h3Font].join(' ')}>Block list</div>
        <div className={helpText}>{user.blockList.length} blocked users are forbidden to send you notification</div>
        <br/>
        { unwrap ?
            <table className={simpleCasket}>
                <tbody>
                {
                    user.blockList.map((blEl, i) => {
                        return <tr key={i} className={simpleCasketTr}>
                                <td className={h4Font}>{blEl.login}</td>
                                <td className={[floatr, cntrVContent, simpleCasketRo].join(' ')} style={{}}>
                                    <IconButton onClick={ () => handleUnblockUser(i) }>
                                        <img src={logoMinus} alt={"Minus user"}/>
                                    </IconButton>
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
    const [user, setUser] = useState<TUser>(curUser)
    const syncPref = () => {
        getPreferences().then(resp => {
            if (resp.status === 200) {
                setUser({
                    ...user, prefs: resp.data.prefs, blockList: resp.data.black_list
                })
            }
        })
    }

    useEffect(() => {
        syncPref()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div className={commonPage}>
        <div className={hFont}>Account</div>
        <div className={helpText}>Here you can view device actions history or your activity</div><br/>

        <NavSeq currentPage={ACCOUNT_PAGE}/><br/>

        <div style={{gap: 20, display: "flex"}}>
            <AccountDataElementL user={user} onChange={() => syncPref()}/>
            <AccountDataElementR user={user} onChange={() => syncPref()}/>
        </div>
    </div>
}