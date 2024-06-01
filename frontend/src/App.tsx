import React, {useContext, useEffect, useState} from 'react';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import {privateRoutes, publicRoutes} from "./routes";
import {UserGlobalContext} from "./globals/providers/UserAuthProvider";
import {HOME_PAGE, LOGIN_PAGE} from "./utils/consts";
import {NavBar} from "./components/NavBar";
import {Box, CssBaseline, ThemeProvider} from "@mui/material";
import {ModalProvider} from "./components/modals/ModalProvider";
import {DarkModeContext} from "./globals/providers/DarkModeProvider";
import {lightTheme} from "./components/mui/lightThemeStyle";
import {darkTheme} from "./components/mui/darkThemeStyle";

function AppRouter() {
    const {authorized} = useContext (UserGlobalContext);

    return <BrowserRouter>
        {authorized ? <NavBar/> : <></>}
        <Routes>
            {authorized
                ? privateRoutes.map (({path, Component}, i) =>
                    <Route path={path} element={Component} key={i}/>)
                : publicRoutes.map (({path, Component}, i) =>
                    <Route path={path} element={Component} key={i}/>)
            }

            <Route
                path="*"
                element={<Navigate
                    to={authorized ? HOME_PAGE : LOGIN_PAGE}
                    replace
                />}
            />
        </Routes>
    </BrowserRouter>
}


const App = () => {
    const {globalDark} = useContext (DarkModeContext);
    const [darkMode, setDarkMode] = useState<boolean> (globalDark);

    useEffect (() => {
        setDarkMode (globalDark)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [globalDark])

    return (
        // activate theme for mui elements
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <CssBaseline/>

            {/* global popover window */}
            <ModalProvider>

                <Box sx={{display: "flex", flexDirection: "column", height: "100vh", bgcolor: "background.default"}}>
                    <AppRouter/>
                </Box>

            </ModalProvider>

        </ThemeProvider>


    )
}

export default App;
