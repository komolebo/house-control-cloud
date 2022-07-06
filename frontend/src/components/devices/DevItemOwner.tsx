import React, {FC, useEffect, useState} from "react";
import {devOwner, devOwnerBottom, devOwnerConnusrProp, devOwnerTop} from "../../styles/DeviceItem.css";
import {h3Font, h4Font, helpText} from "../../styles/common/fonts.css";
import {Button} from "@mui/material";
import logoInvite from "../../assets/invite-users.svg"
import {MODAL_TYPE, useGlobalModalContext} from "../modals/ModalProvider";
import {ColorRoleLabel} from "../elements/ColorRoleLabel";
import {TConnectedUser, TDevItem, TDevRole} from "../../globals/DeviceData";
import {fulWidMuiBtn, shortMuiBtn} from "../../styles/common/buttons.css";
import {styleHeights} from "../../styles/common/customMuiStyle";
import {getUserInfo} from "../../globals/UserAuthProvider";
import {fetchConnUsersByDevice, postClearDeviceUsers} from "../../http/rqData";

interface IDevOwnerProps {
    devInfo: TDevItem,
    onUsrInvite: (devId: string, userInfo: TConnectedUser) => void,
    onDevDataChanged: () => void
}

const userInfo = getUserInfo();


const DevItemOwner: FC<IDevOwnerProps> = ({devInfo,
                                           onUsrInvite,
                                           onDevDataChanged}) => {
    const [users, setUsers] = useState<Array<TConnectedUser>>([]);
    const { showModal, hideModal } = useGlobalModalContext();

    const handleClrSettings = (devInfo: TDevItem) => {
        postClearDeviceUsers(devInfo.hex).then(resp => {
            console.log("Cleared device: ", resp)
            if (resp.status === 201) {
                onDevDataChanged();
            }
        })
    }
    const handleInviteUsr = (userInfo: TConnectedUser) => {
        onUsrInvite(devInfo.hex, userInfo);
    }
    const handleModifyUsr = (userInfo: TConnectedUser) => {

    }

    useEffect(() => {
        fetchConnUsersByDevice(devInfo.id, (uList) => {
            if (JSON.stringify(uList) !== JSON.stringify(users)) {
                setUsers(uList);
            }
        })
    })

    return <div id={devOwner}>
        <div className={h3Font}>Connected users: </div>

        <div id={devOwnerTop}>
            <table>
                <tr style={{paddingTop: '100px', paddingBottom: '100px'}}>
                    <th id={devOwnerConnusrProp}  className={helpText} style={{textAlign: "left"}}>Name</th>
                    <th id={devOwnerConnusrProp} className={helpText} style={{textAlign: "left"}}>Status</th>
                    <th id={devOwnerConnusrProp}  className={helpText} style={{textAlign: "left"}}>ID</th>
                    <th id={devOwnerConnusrProp}  className={helpText} style={{textAlign: "left"}}>Action</th>
                </tr>
                {users.map(conn_user => {
                    const isIdMatched = conn_user.id === userInfo?.id;
                    return <tr>
                        <td id={devOwnerConnusrProp} className={h4Font}>{conn_user.name}</td>
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
                        <td id={devOwnerConnusrProp} className={h4Font}>0x{conn_user.id}</td>
                        <td>
                            <Button variant={"outlined"}
                                    color={"info"}
                                    disabled={isIdMatched || conn_user.role === TDevRole.OWNER}
                                    onClick={() => showModal(MODAL_TYPE.ModifyUsrAccessModal, {
                                        onClose: () => {console.log("Modal onClose")},
                                        onAct: () => onDevDataChanged(),
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
            </table>
        </div>


        <div id={devOwnerBottom}>
            <Button
                endIcon={ <img src={logoInvite} alt={"Logo invite"}/>}
                onClick={() => showModal(MODAL_TYPE.InviteUsrModal, {
                    onClose: () => {console.log("Modal onClose")},
                    onAct: (userInfo) => handleInviteUsr(userInfo)
                })}
                variant={"outlined"} sx={{
                    mr: 2
                }}
                className={shortMuiBtn}
            >
                Invite
            </Button>

            <Button variant={"outlined"}
                    color={"error"}
                    onClick={() => showModal(MODAL_TYPE.ClrSettModal, {
                        onClose: () => {hideModal()},
                        onAct: () => {handleClrSettings(devInfo)},
                        data: devInfo
                    })}
                    className={shortMuiBtn}
            >
                Clear users
            </Button>
        </div>
    </div>
}

export default DevItemOwner;