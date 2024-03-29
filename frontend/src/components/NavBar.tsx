import React, {useContext, useEffect, useState} from "react";
import {navBar} from "../styles/NavBar.css";
import {
    AppBar,
    Avatar,
    Box, Card,
    ClickAwayListener, Divider,
    IconButton,
    Menu,
    MenuItem, MenuList, Paper, Popper, Select,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import {ReactComponent as LogoHomeNet} from "../assets/home-net.svg";
import logoHomeNetCloud from "../assets/home-net-cloud.svg";
import logoFaq from "../assets/nav-faq.svg";
import {ReactComponent as LogoMenuAccount} from '../assets/menu-item-account.svg';
import {ReactComponent as LogoMenuHistory} from '../assets/menu-item-history.svg';
import {ReactComponent as LogoMenuLogout} from '../assets/menu-item-logout.svg';

import logoMsgYes from "../assets/nav-notification-yes.svg";
import logoMsgNo from "../assets/nav-notification-no.svg";
import {NotifyBar} from "./NotifyBar";
import {styleHeights} from "../styles/common/customMuiStyle";
import {UserGlobalContext} from "../globals/providers/UserAuthProvider";
import {nestGetPreference, isNotificationPerUser} from "../http/rqData";
import {IO_NOTIFICATION_KEY, SocketContext} from "../http/wssocket";
import {useNavigate} from "react-router-dom";
import {ACCOUNT_PAGE, HISTORY_PAGE, HOME_PAGE} from "../utils/consts";
import {cntrContent} from "../styles/common/position.css";
import set = Reflect.set;


export const NavBar: React.FC = () => {
    const settingsMenu = [
        {name: 'Account', handler: () => navigate(ACCOUNT_PAGE), icon: <LogoMenuAccount fill='currentColor'/>},
        {name: 'History', handler: () => navigate(HISTORY_PAGE), icon: <LogoMenuHistory fill='currentColor'/>},
        {name: "", handler: () => {}},
        {name: 'Logout', handler: () => clearUserData(), icon: <LogoMenuLogout stroke='currentColor'/>},
    ];
    const {clearUserData, avatarSrc, setAvatarSrc, userInfo} = useContext(UserGlobalContext);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [anchorElMsg, setAnchorElMsg] = useState<null | HTMLElement>(null);
    const [notification, setNotification] = useState<boolean>(false);
    const socket = useContext(SocketContext);
    const navigate = useNavigate();

    useEffect(() => {
        userInfo && nestGetPreference(userInfo.id).then(resp => {
            if (resp.status === 200 || resp.status === 201) {
                const preference = resp.data.preference
                preference && setAvatarSrc(preference.profile_photo);
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo])

    useEffect(() => {
        const onNotification = (data: any) => {
            console.log("NavBar onNotification")
            syncNotificationStatus();
        }
        socket.on(IO_NOTIFICATION_KEY, onNotification);

        syncNotificationStatus();
        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            socket.off(IO_NOTIFICATION_KEY, onNotification);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleOpenMsgMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElMsg(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseMsgMenu = () => {
        setAnchorElMsg(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const syncNotificationStatus = () => {
        userInfo && isNotificationPerUser(userInfo.id)
            .then(resp => {
                console.log("isNotificationPerUser resp: ", resp.data)
                if (resp.status === 200 || resp.status === 201) {
                    setNotification(resp.data);
                }
            })
    }

    return (
        <div id={navBar}>
        <AppBar position="static">
            <Toolbar 
                sx={styleHeights.toolbar}
                className={navBar}
            >
                <IconButton onClick={() => navigate(HOME_PAGE)} sx={{ ml: 4 }} >
                    <LogoHomeNet style={{ color: "white" }} />
                </IconButton>

                <Box sx={{ml: 1, flexGrow: 3}}>
                    <img src={logoHomeNetCloud} alt={"Logo HomeNet cloud"}/>
                </Box>

                <IconButton color="inherit" >
                    <img src={logoFaq} alt={"Logo FAQ"}/>
                </IconButton>

                <IconButton onClick={handleOpenMsgMenu} color="inherit" sx={{ml: 1}}>
                    {notification
                        ? <img src={logoMsgYes} alt={"Yes!"}/>
                        : <img src={logoMsgNo} alt={"No!"}/>
                    }
                </IconButton>
                {anchorElMsg &&
                    <ClickAwayListener onClickAway={() => handleCloseMsgMenu()}>
                        <Popper id={'simple-popper'}
                                open={Boolean(anchorElMsg)}
                                anchorEl={anchorElMsg}
                                style={{zIndex: 2}}
                        >
                            <NotifyBar
                                onNotificationStatusChange={syncNotificationStatus}
                            />
                        </Popper>
                    </ClickAwayListener>
                }

                <Box sx={{mr: 6}}>
                    <Tooltip title="Open settings">
                        <Box display="flex">
                            <IconButton onClick={handleOpenUserMenu} sx={{p: 0, ml: 2, mr: 1}}>
                                <Avatar alt="Remy Sharp" src={avatarSrc} className="small" />
                            </IconButton>
                            <Typography paddingTop={2}>{userInfo ? userInfo.full_name : "not_authorized"}</Typography>
                        </Box>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px'}}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                        onClick={handleCloseUserMenu}
                        MenuListProps={{
                            sx: {backgroundColor: "special.main"}
                        }}
                    >
                        {settingsMenu.map((setting, i) => (
                                !setting.name
                                ? <Divider key={i}/>
                                : <MenuItem
                                        dense={true}
                                        key={i}
                                        onClick={() => setting.handler()}
                                        // sx={{backgroundColor: "yellow"}}
                                    >
                                        <Box
                                            sx={{mr: 1, width: 24}}
                                            className={cntrContent}
                                        >
                                            {setting.icon}
                                        </Box>

                                        <Typography textAlign="right" color="2F3542">{setting.name}</Typography>
                                    </MenuItem>
                            ))}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
        </div>
    )
}
