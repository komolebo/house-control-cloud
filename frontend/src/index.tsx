import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {ModalProvider} from "./components/modals/ModalProvider";
import {ThemeProvider} from "@mui/material";
import {theme} from "./components/mui/muiOverride";
import {UserAuthProvider} from "./globals/UserAuthProvider";

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <ModalProvider>
            <UserAuthProvider>
                <App/>
            </UserAuthProvider>
        </ModalProvider>
    </ThemeProvider>,
    document.getElementById('root')
);