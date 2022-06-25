import React, {FC} from "react";
import {IProps, TDevRole} from "./DevItem";
import {devOwner, devOwnerBottom, devOwnerConnusrProp, devOwnerTop} from "../../styles/DeviceItem.css";
import {h3Font, h4Font, helpText} from "../../styles/common/fonts.css";
import {Button, Chip} from "@mui/material";
import logoInvite from "../../assets/invite-users.svg"

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

const DevItemOwner: FC<IProps> = ({dev}: IProps) => {
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

                {dev.users.map(conn_user => {
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
                            {/*<div className={rmBtn} onClick={() => {console.log("good")}}/>*/}
                            {active
                                ? <Button variant={"outlined"}
                                          color= "error"
                                          disabled={false}
                                          sx={{
                                              height: 24, width: '100%',
                                              textTransform: 'none', borderRadius: 47,
                                              fontWeight: 550,
                                              backgroundColor: '#ffdcd5',
                                          }}>
                                    Delete
                                </Button>
                                : <Button variant={"outlined"}
                                          color={"error"}
                                          disabled={true}
                                          sx={{
                                              height: 24, width: '100%',
                                              textTransform: 'none', borderRadius: 47,

                                              fontWeight: 550
                                          }}>
                                    Delete
                                </Button>
                            }

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

            <Button variant={"outlined"} color={"error"} sx={{
                width: 140,
                height: 42,
                borderRadius: 47,
                textTransform: 'none'
            }}>
                Clear settings
            </Button>
        </div>
        {/*<DevItem user={user}/>*/}

        {/*<div id={devOwner}>*/}


        {/*    <div id={devOwnerBottom}>*/}
        {/*        /!*<button className={btn}>*!/*/}
        {/*        /!*    RESET DEVICE*!/*/}
        {/*        /!*</button>*!/*/}
        {/*        <Box textAlign={'center'}>*/}
        {/*            <Button variant="outlined" color="error">*/}
        {/*                RESET DEVICE*/}
        {/*            </Button>*/}
        {/*        </Box>*/}
        {/*        /!*<div className={[colRed, cntrTxt].join(' ')}>Warning:</div>*!/*/}
        {/*        /!*<div className={[colRed, cntrTxt].join(' ')}>*!/*/}
        {/*        /!*    this will reset all device users*!/*/}
        {/*        /!*</div>*!/*/}
        {/*        <Typography align={"center"} variant="body2" display="c" gutterBottom>*/}
        {/*            this will reset all device users*/}
        {/*        </Typography>*/}
        {/*    </div>*/}

        {/*</div>*/}
    </div>
}

export default DevItemOwner;