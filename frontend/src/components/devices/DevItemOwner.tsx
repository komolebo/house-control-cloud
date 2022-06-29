import React, {FC, useState} from "react";
import {IProps, TConnectedUser, TDevItem, TDevRole} from "./DevItem";
import {devOwner, devOwnerBottom, devOwnerConnusrProp, devOwnerTop} from "../../styles/DeviceItem.css";
import {h3Font, h4Font, helpText} from "../../styles/common/fonts.css";
import {Button, Chip} from "@mui/material";
import logoInvite from "../../assets/invite-users.svg"
import {MODAL_TYPE, useGlobalModalContext} from "../modals/ModalProvider";
import {ColorRoleLabel} from "../elements/ColorRoleLabel";
import {cntrContent, cntrVContent} from "../../styles/common/position.css";

interface IDevOwnerProps {
    devInfo: TDevItem,
    onDevClrSetting: (id: string) => void,
    onUsrInvite: (devId: string, userInfo: TConnectedUser) => void
}



const DevItemOwner: FC<IDevOwnerProps> = ({
                                              devInfo,
                                              onDevClrSetting,
                                              onUsrInvite}) => {
    const { showModal, hideModal } = useGlobalModalContext();


    const handleClrSettings = (devInfo: TDevItem) => {
        onDevClrSetting(devInfo.hex);
    }
    const handleInviteUsr = (userInfo: TConnectedUser) => {
        console.log("userInfo", userInfo)
        onUsrInvite(devInfo.hex, userInfo);
    }

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

                {devInfo.users.map(conn_user => {
                    const active = conn_user.name !== 'Oleh';
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
                                    color= "info"
                                    disabled={!active}
                                    onClick={() => showModal(MODAL_TYPE.ModifyUsrAccessModal, {
                                        onClose: () => {console.log("Modal onClose")},
                                        onAct: () => {},
                                        data: {usrInfo: conn_user, devInfo: devInfo}
                                    })}

                                    sx={active
                                        ? {
                                          height: 24, width: '100%',
                                          textTransform: 'none', borderRadius: 47,
                                          // fontWeight: 550,
                                          // backgroundColor: '#ffdcd5',
                                          background: "rgba(22, 144, 233, 0.2)"
                                        }
                                        : {
                                          height: 24, width: '100%',
                                          textTransform: 'none', borderRadius: 47,

                                          // fontWeight: 550
                                        }
                                    }
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
                endIcon={ <img src={logoInvite}/>}
                onClick={() => showModal(MODAL_TYPE.InviteUsrModal, {
                    onClose: () => {console.log("Modal onClose")},
                    onAct: (userInfo) => handleInviteUsr(userInfo)
                })}
                variant={"outlined"} sx={{
                width: 130, height: 42, borderRadius: 47,
                textTransform: 'none',
                marginRight: 2
                }}
            >
                Invite
            </Button>

            <Button variant={"outlined"}
                    color={"error"}
                    sx={{
                width: 140,
                height: 42,
                borderRadius: 47,
                textTransform: 'none'
            }}
                    onClick={() => showModal(MODAL_TYPE.ClrSettModal, {
                        onClose: () => {hideModal()},
                        onAct: () => {handleClrSettings(devInfo)},
                        data: devInfo
                    })}
            >
                Clear settings
            </Button>
        </div>
    </div>
}

export default DevItemOwner;