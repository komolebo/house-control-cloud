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
import {getUserInfo, UserAuthContext} from "../globals/UserAuthProvider";
import {isNotificationPerUser} from "../http/rqData";


const userInfo = getUserInfo();

export const NavBar: React.FC = () => {
    const {clearUserData} = useContext(UserAuthContext);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [anchorElMsg, setAnchorElMsg] = useState<null | HTMLElement>(null);
    const [notification, setNotification] = useState<boolean>(false);

    const settingsMenu = [
        {name: 'Profile', handler: () => {}},
        {name: 'Account', handler: () => {}},
        {name: 'Dashboard', handler: () => {}},
        {name: 'Logout', handler: () => clearUserData()},
    ];

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

    useEffect(() => {
        syncNotificationStatus();
    }, [])

    return (
        <div id={navBar}>
        <AppBar position="static">
            <Toolbar sx={styleHeights.toolbar}
                     className={navBar}
            >
                <IconButton sx={{ ml: 4 }} >
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
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 2 }}>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                            </IconButton>
                            <Typography paddingTop={3}>{userInfo ? userInfo.name : "not_authorized"}</Typography>
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
