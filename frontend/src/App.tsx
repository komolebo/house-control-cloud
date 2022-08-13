import React, {useContext, useEffect, useState} from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {privateRoutes, publicRoutes} from "./routes";
import {UserAuthProvider, UserGlobalContext} from "./globals/UserAuthProvider";
import {HOME_PAGE, LOGIN_PAGE} from "./utils/consts";
import {NavBar} from "./components/NavBar";
import {CssBaseline, darkScrollbar, GlobalStyles, ThemeProvider} from "@mui/material";
import {darkTheme, lightTheme} from "./components/mui/muiOverride";
import {ModalProvider} from "./components/modals/ModalProvider";

function AppRouter() {
    const  {authorized} = useContext(UserGlobalContext);

    return <BrowserRouter>
        { authorized ? <NavBar/> : <></> }
        <Routes>
            {authorized
                ? privateRoutes.map(({path, Component}, i) =>
                    <Route path={path} element={Component} key={i}/>)
                : publicRoutes.map(({path, Component}, i) =>
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
    const {userInfo} = useContext(UserGlobalContext);
    const [dark, setDark] = useState(userInfo?.preference?.dark_mode);

    useEffect(() => {
        setDark(userInfo?.preference?.dark_mode)
    }, [userInfo])

    return (
        <ThemeProvider theme={dark ? darkTheme : lightTheme}>
            <CssBaseline/>
            <GlobalStyles styles={dark ? { ...darkScrollbar() } : undefined} />
            <ModalProvider>
                <AppRouter/>
            </ModalProvider>
        </ThemeProvider>
    )
}

export default App;
