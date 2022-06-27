import React, {useState} from "react";
import {navBar} from "../styles/NavBar.css";
import {
    AppBar,
    Avatar,
    Box,
    Button, ClickAwayListener,
    IconButton,
    Menu,
    MenuItem, Paper,
    Popper,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import logoHomeNet from "../assets/home-net.svg";
import logoHomeNetCloud from "../assets/home-net-cloud.svg";
import logoFaq from "../assets/nav-faq.svg";
import logoMsgYes from "../assets/nav-notification-yes.svg";
import {h2Font, h4FontBlue} from "../styles/common/fonts.css";
import {colBlue} from "../styles/common/colors.css"
import {NotifyBar} from "./NotifyBar";

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];


export const NavBar: React.FC = () => {
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [anchorElMsg, setAnchorElMsg] = React.useState<null | HTMLElement>(null);

    const handleOpenMsgMenu = (event: React.MouseEvent<HTMLElement>) => {
        console.log("open");
        setAnchorElMsg(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        console.log("change open anchorElUser");
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseMsgMenu = () => {
        console.log("close");
        setAnchorElMsg(null);
    };

    const handleCloseUserMenu = () => {
        console.log("change close anchorElUser");
        setAnchorElUser(null);
    };

    return (
        <div id={navBar}>
        <AppBar position="static">
            <Toolbar sx={{
                // backgroundColor: "#1690E9"
                height: 100
            }}>
                <IconButton sx={{ ml: 4 }} >
                    <img src={logoHomeNet}/>
                    {/*<img src={logoHomeNetCloud}/>*/}
                    {/*<MenuIcon />*/}
                </IconButton>

                <Box sx={{ml: 1, flexGrow: 3}}>
                    <img src={logoHomeNetCloud}/>
                </Box>

                <IconButton color="inherit" >
                    <img src={logoFaq}/>
                </IconButton>

                <IconButton onClick={handleOpenMsgMenu} color="inherit" sx={{ml: 1}}>
                    <img src={logoMsgYes}/>
                </IconButton>
                {anchorElMsg &&
                    <ClickAwayListener onClickAway={() => handleCloseMsgMenu()}>
                        <Popper id={'simple-popper'}
                                open={Boolean(anchorElMsg)}
                                anchorEl={anchorElMsg}
                        >
                            <NotifyBar/>
                        </Popper>
                    </ClickAwayListener>
                }

                <Box sx={{mr: 6}}>
                    <Tooltip title="Open settings">
                        <Box display="flex">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 2 }}>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                            </IconButton>
                            <Typography paddingTop={3}>Username</Typography>
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
                        {settings.map((setting) => (
                            <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                <Typography textAlign="right">{setting}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
        </div>
    )
}
