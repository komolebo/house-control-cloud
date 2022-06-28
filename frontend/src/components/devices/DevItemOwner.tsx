import React, {FC, useState} from "react";
import {IProps, TDevItem, TDevRole} from "./DevItem";
import {devOwner, devOwnerBottom, devOwnerConnusrProp, devOwnerTop} from "../../styles/DeviceItem.css";
import {h3Font, h4Font, helpText} from "../../styles/common/fonts.css";
import {Button, Chip} from "@mui/material";
import logoInvite from "../../assets/invite-users.svg"
import {ClearSettingsPopup} from "../popup/ClearSettingsPopup";

interface IDevOwnerProps {
    devInfo: TDevItem,
    onDevClrSetting: (id: string) => void
}

const RoleColor = (role: TDevRole) => {
    switch (role) {
        case TDevRole.OWNER:
            return "error"
        case TDevRole.GUEST:
            return "warning";
        case TDevRole.CHILD:
            return "info";
        default:
            return "default"
    }
}

const DevItemOwner: FC<IDevOwnerProps> = ({devInfo, onDevClrSetting}) => {
    let [popClrSett, setPopClrSet] = useState(false);

    const handleClrSettings = (devInfo: TDevItem) => {
        onDevClrSetting(devInfo.hex);
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
                            <Chip label={TDevRole[conn_user.role]} color={RoleColor(conn_user.role)}  />
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
                                      color= "error"
                                      disabled={!active}

                                      sx={active
                                          ? {
                                              height: 24, width: '100%',
                                              textTransform: 'none', borderRadius: 47,
                                              fontWeight: 550,
                                              backgroundColor: '#ffdcd5',
                                          }
                                          : {
                                              height: 24, width: '100%',
                                              textTransform: 'none', borderRadius: 47,

                                              fontWeight: 550
                                          }
                                      }
                            >
                                Delete
                            </Button>
                        </td>
                    </tr>
                })}
            </table>
        </div>


        <div id={devOwnerBottom}>
            <Button variant={"outlined"} sx={{
                width: 130,
                height: 42,
                borderRadius: 47,
                textTransform: 'none',
                marginRight: 2
            }} endIcon={ <img src={logoInvite}/>}
            >
                Invite
            </Button>

            <Button variant={"outlined"}
                    color={"error"}
                    onClick={() => {setPopClrSet(true)}}
                    sx={{
                width: 140,
                height: 42,
                borderRadius: 47,
                textTransform: 'none'
            }}
            >
                Clear settings
            </Button>
        </div>

        {popClrSett &&
            <ClearSettingsPopup onClose={() => setPopClrSet(false)}
                                onClear={(hex) => handleClrSettings(hex)}
                                devInfo={devInfo}
            />
        }
    </div>
}

export default DevItemOwner;