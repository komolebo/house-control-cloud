import React from 'react';
import App from './App';
import {ModalProvider} from "./components/modals/ModalProvider";
import {ThemeProvider} from "@mui/material";
import {theme} from "./components/mui/muiOverride";
import {UserAuthProvider} from "./globals/UserAuthProvider";
import {createRoot} from "react-dom/client";


const rootEl = document.getElementById('root')
if (rootEl === null) throw new Error('Root container missing in index.html')

const root = createRoot(rootEl)
root.render(
    <ThemeProvider theme={theme}>
        <UserAuthProvider>
            <ModalProvider>
                <App/>
            </ModalProvider>
        </UserAuthProvider>
    </ThemeProvider>
);