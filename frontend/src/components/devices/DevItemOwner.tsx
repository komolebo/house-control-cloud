import React, {FC, useContext, useEffect, useState} from "react";
import {devOwnerBottom, devOwnerConnusrProp, devOwnerTop} from "../../styles/DeviceItem.css";
import {h3Font, h4Font, helpText} from "../../styles/common/fonts.css";
import {Avatar, Button, Typography} from "@mui/material";
import logoInvite from "../../assets/invite-users.svg"
import {MODAL_TYPE, useGlobalModalContext} from "../modals/ModalProvider";
import {ColorRoleLabel} from "../elements/ColorRoleLabel";
import {TConnectedUser, TDevItem, TDevRole} from "../../globals/DeviceData";
import {fulWidMuiBtn, shortMuiBtn} from "../../styles/common/buttons.css";
import {styleHeights} from "../../styles/common/customMuiStyle";
import {UserGlobalContext} from "../../globals/UserAuthProvider";
import {fetchConnUsersByDevice} from "../../http/rqData";
import {cntrVContent} from "../../styles/common/position.css";

interface IDevOwnerProps {
    devInfo: TDevItem,
    onDevDataChanged: () => void
}

const DevItemOwner: FC<IDevOwnerProps> = ({devInfo,
                                           onDevDataChanged}) => {
    const [users, setUsers] = useState<Array<TConnectedUser>>([]);
    const { showModal, hideModal } = useGlobalModalContext();
    const {userInfo} = useContext(UserGlobalContext)

    const syncUsers = () => {
        fetchConnUsersByDevice(devInfo.hex, uList => {
            console.log("fetchConnUsersByDevice ", devInfo.name)
            // if (JSON.stringify(uList) !== JSON.stringify(users)) {
                setUsers(uList);
            // }
        })
    }

    useEffect(() => {
        syncUsers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [devInfo])

    return <>
        <Typography variant="h4">Connected users: </Typography>

        <div id={devOwnerTop}>
            <table>
                <thead><tr style={{paddingTop: '100px', paddingBottom: '100px'}}>
                    <th id={devOwnerConnusrProp}  className={helpText} style={{textAlign: "left"}}>Name</th>
                    <th id={devOwnerConnusrProp} className={helpText} style={{textAlign: "left"}}>Status</th>
                    {/*<th id={devOwnerConnusrProp}  className={helpText} style={{textAlign: "left"}}>ID</th>*/}
                    <th id={devOwnerConnusrProp}  className={helpText} style={{textAlign: "left"}}>Action</th>
                </tr></thead>

                <tbody>
                {users.map(conn_user => {
                    const isIdMatched = conn_user.id === userInfo?.id;
                    return <tr key={conn_user.login}>
                        <td id={devOwnerConnusrProp}>
                            <div style={{display: "flex"}} className={cntrVContent}>
                                <Avatar alt="Remy Sharp"
                                        src={conn_user.urlPic}
                                        style={{width: 50, height: 50, marginRight: 10, border: "2px solid #1690E9"}} />
                                <Typography variant="h3">{conn_user.fullName} </Typography>
                            </div>
                        </td>
                        <td id={devOwnerConnusrProp} className={h4Font}>
                            <ColorRoleLabel role={conn_user.role}/>
                            {/*<Chip label={TDevRole[conn_user.role]} color="default"  />*/}
                            {/*<Chip label={TDevRole[conn_user.role]} color="primary" />*/}
                            {/*<Chip label={TDevRole[conn_user.role]} color="secondary" />*/}
                            {/*<Chip label={TDevRole[conn_user.role]} color="error" />*/}
                            {/*<Chip label={TDevRole[conn_user.role]} color="info"  />*/}
                            {/*<Chip label={TDevRole[conn_user.role]} color="success" />*/}
                            {/*<Chip label={TDevRole[conn_user.role]} color="warning"  />*/}
                        </td>
                        {/*<td id={devOwnerConnusrProp} className={h4Font}>{conn_user.login}</td>*/}
                        <td>
                            <Button variant={"outlined"}
                                    color={"info"}
                                    disabled={isIdMatched || conn_user.role === TDevRole.OWNER}
                                    onClick={() => showModal(MODAL_TYPE.ModifyUsrAccessModal, {
                                        onClose: () => {console.log("Modal onClose")},
                                        onAct: () => {},
                                        data: {usrInfo: conn_user, devInfo: devInfo, userList: users}
                                    })}
                                    sx={styleHeights.lowBtn}
                                    className={[fulWidMuiBtn].join(' ')}
                            >
                                Modify
                            </Button>
                        </td>
                    </tr>
                })}
                </tbody>
            </table>
        </div>


        <div id={devOwnerBottom}>
            <Button
                endIcon={ <img src={logoInvite} alt={"Logo invite"}/>}
                onClick={() => showModal(MODAL_TYPE.InviteUsrModal, {
                    onClose: () => {console.log("Modal onClose")},
                    onAct: () => {},
                    data: {devInfo: devInfo}
                })}
                variant={"outlined"} sx={{
                    mr: 2
                }}
                color="info"
                className={shortMuiBtn}
            >
                Invite
            </Button>

            <Button variant={"outlined"}
                    color={"error"}
                    onClick={() => showModal(MODAL_TYPE.ClrSettModal, {
                        onClose: () => {hideModal()},
                        onAct: () => {},
                        data: {...devInfo}
                    })}
                    className={shortMuiBtn}
            >
                Clear users
            </Button>
        </div>
    </>
}

export default DevItemOwner;