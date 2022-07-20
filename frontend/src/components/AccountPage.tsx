import React, {FC, useState} from "react";
import {commonCasket, commonPage, simpleCasket, simpleCasketRo, simpleCasketTr} from '../styles/common/pages.css'
import {h2Font, h3Font, h4Font, h5Font, helpText, hFont} from "../styles/common/fonts.css";
import {NavSeq} from "./NavSeq";
import {ACCOUNT_PAGE} from "../utils/consts";
import logoAva from "../assets/avatars/avatar1.svg"
import {imgHover, lowMuiBtn, shorterMuiBtn, shortMuiBtn, wideMuiBtn} from "../styles/common/buttons.css";
import {Button, FormControlLabel, IconButton, Switch, TextField} from "@mui/material";
import {cntrContent, cntrVContent, flexG1, floatl, floatr} from "../styles/common/position.css";
import logoEdit from "../assets/edit-device.svg";
import logoVerified from "../assets/verified.svg";
import logoUncollapse from "../assets/uncollapse.svg";
import logoCollapse from "../assets/collapse.svg";
import logoMinus from "../assets/blue-minus2.svg";
import {spaceNoPad, spaceTextEdit, spaceTextEditNoBottom} from "../styles/common/spaces.css";
import {TUser} from "../globals/AccountData";
import {colBlue} from "../styles/common/colors.css";
import logoDelete from "../assets/delete-account.svg";
import logoSettings from "../assets/settings.svg";

interface IState {
    editMode: boolean;
    user: TUser;
    blockListUnwrap: boolean;
}

const curUser: TUser = {
    name: "Svetlana",
    email: "Svetlana@gmail.com",
    phone: "+380966551328",
    login: "Svetik23",
    blockList: ["Petro11", "Oleh23", "Afanasiy", "Evkakiy"],
    emailVerified: true,
    phoneVerified: false
}

const initialState = {
    editMode: false,
    user: curUser,
    blockListUnwrap: false
}

const AccountDataEditElement: FC = () => {
    const [state, setState] = useState<IState>(initialState)

    return <div className={[commonCasket, flexG1].join(' ')}>
        <div className={h2Font}>Avatar</div>

        <div className={cntrVContent}>
            <div style={{textAlign: "center"}}>
                <img src={logoAva} alt={"Logo ava"}/>
                <div className={h4Font}>Svetik23</div>
            </div>

            <Button
                onClick={() => {}}
                variant={"outlined"} sx={{ ml: 1 }}
                className={[shortMuiBtn].join(' ')}
            >
                Upload
            </Button>

            <Button
                onClick={() => {}}
                color={"inherit"}
                variant={"outlined"} sx={{ ml: 2 }}
                className={[shortMuiBtn].join(' ')}
            >
                Remove
            </Button>
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
                            error={state.user.name.length === 0}
                            label={state.user.name.length === 0 ? "Name cannot be empty" : ""}
                            id="outlined-uncontrolled"
                            color={"info"}
                            defaultValue={curUser.name}
                            fullWidth={true}
                            onChange={e => setState ({...state, user: {...state.user, name: e.target.value}})}
                            size={"small"}
                        />
                    </div>
                    : <div className={[h4Font, spaceTextEdit].join (' ')}>{state.user.name}</div>
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
                            defaultValue={curUser.phone}
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
                            defaultValue={curUser.email}
                            onChange={e => setState ({...state, user: {...state.user, email: e.target.value}})}
                            fullWidth={true}
                            size={"small"}
                        />
                    </div>
                    : <div className={[h4Font, spaceTextEdit].join (' ')}>{state.user.email}</div>
                }
                <div className={[colBlue, h5Font].join(' ')}>&nbsp; Verified &nbsp;
                    <img src={logoVerified}/>
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

const AccountDataElementR = () => {
    const [unwrap, setUnwrap] = useState(false);

    return <div className={commonCasket}>
        <div style={{display: "flex", justifyContent: "flex-end"}}>
            <FormControlLabel control={<Switch  />} label="Dark mode"/>
        </div><br/>

        <IconButton className={floatr}
            // style={{padding: 0, paddingLeft: 10}}
                    onClick={() => setUnwrap(!unwrap)} >
            <img src={unwrap ? logoCollapse : logoUncollapse} alt={"Collapse logo"}/>
        </IconButton>
        <div className={[h3Font].join(' ')}>Block list</div>
        <div className={helpText}>{curUser.blockList.length} blocked users are forbidden to send you notification</div>
        <br/>
        { unwrap ?
            <table className={simpleCasket}>
                <tbody>
                {
                    curUser.blockList.map((name, i) => {
                        return <tr className={simpleCasketTr}>
                                <td className={h4Font}>{name}</td>
                                <td className={[floatr, cntrVContent, simpleCasketRo].join(' ')} style={{}}>
                                    <IconButton>
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
    return <div className={commonPage}>
        <div className={hFont}>Account</div>
        <div className={helpText}>Here you can view device actions history or your activity</div><br/>

        <NavSeq currentPage={ACCOUNT_PAGE}/><br/>

        <div style={{gap: 20, display: "flex"}}>
            <AccountDataEditElement/>
            <AccountDataElementR/>
        </div>
    </div>
}