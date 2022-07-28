import React, {useContext, useEffect, useState} from "react";
import {navBar} from "../styles/NavBar.css";
import {
    AppBar,
    Avatar,
    Box,
    ClickAwayListener,
    IconButton,
    Menu,
    MenuItem, Popper,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import logoHomeNet from "../assets/home-net-white.svg";
import logoHomeNetCloud from "../assets/home-net-cloud.svg";
import logoFaq from "../assets/nav-faq.svg";
import logoMsgYes from "../assets/nav-notification-yes.svg";
import logoMsgNo from "../assets/nav-notification-no.svg";
import {NotifyBar} from "./NotifyBar";
import {styleHeights} from "../styles/common/customMuiStyle";
import {UserGlobalContext} from "../globals/UserAuthProvider";
import {getPreferences, isNotificationPerUser} from "../http/rqData";
import {IO_NOTIFICATION_KEY, SocketContext} from "../http/wssocket";
import {useNavigate} from "react-router-dom";
import {ACCOUNT_PAGE, HISTORY_PAGE, HOME_PAGE} from "../utils/consts";

export const NavBar: React.FC = () => {
    const settingsMenu = [
        {name: 'Account', handler: () => navigate(ACCOUNT_PAGE)},
        {name: 'History', handler: () => navigate(HISTORY_PAGE)},
        {name: 'Logout', handler: () => clearUserData()},
    ];
    const {clearUserData, avatarSrc, setAvatarSrc, userInfo} = useContext(UserGlobalContext);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [anchorElMsg, setAnchorElMsg] = useState<null | HTMLElement>(null);
    const [notification, setNotification] = useState<boolean>(false);
    const socket = useContext(SocketContext);
    const navigate = useNavigate();

    useEffect(() => {
        getPreferences().then(resp => {
            if (resp.status === 200 || resp.status === 201) {
                setAvatarSrc(resp.data.preference.profile_photo);
            }
        })
        syncNotificationStatus();
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
        userInfo && isNotificationPerUser(userInfo?.id)
            .then(resp => {
                console.log("isNotificationPerUser resp: ", resp.data > 0)
                if (resp.status === 200 || resp.status === 201) {
                    setNotification(resp.data);
                }
            })
    }

    return (
        <div id={navBar}>
        <AppBar position="static">
            <Toolbar sx={styleHeights.toolbar}
                     className={navBar}
            >
                <IconButton onClick={() => navigate(HOME_PAGE)} sx={{ ml: 4 }} >
                    <img src={logoHomeNet} alt={"HomeNet logo"}/>
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
                                <Avatar alt="Remy Sharp"
                                        src={avatarSrc}
                                        style={{width: 50, height: 50, border: "2px solid white"}} />
                            </IconButton>
                            <Typography paddingTop={2}>{userInfo ? userInfo.full_name : "not_authorized"}</Typography>
                        </Box>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
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
                    >
                        {settingsMenu.map((setting) => (
                            <MenuItem
                                key={setting.name}
                                onClick={() => setting.handler()}
                            >
                                <Typography textAlign="right">{setting.name}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
        </div>
    )
}
