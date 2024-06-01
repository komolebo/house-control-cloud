import React from 'react';
import App from './App';
import {createRoot} from "react-dom/client";
import {DarkModeProvider} from "./globals/providers/DarkModeProvider";
import {UserAuthProvider} from "./globals/providers/UserAuthProvider";


const rootEl = document.getElementById ('root')
if (rootEl === null) throw new Error ('Root container missing in index.html')

const root = createRoot (rootEl)
root.render (
    // global theme set
    <DarkModeProvider>
        {/* global user data and login */}
        <UserAuthProvider>
            <App/>
        </UserAuthProvider>
    </DarkModeProvider>
);