import React from 'react';
import App from './App';
import {UserAuthProvider} from "./globals/providers/UserAuthProvider";
import {createRoot} from "react-dom/client";
import {DarkModeProvider} from "./globals/providers/DarkModeProvider";


const rootEl = document.getElementById('root')
if (rootEl === null) throw new Error('Root container missing in index.html')

const root = createRoot(rootEl)
root.render(
    <DarkModeProvider>
        <UserAuthProvider>
            <App/>
        </UserAuthProvider>
    </DarkModeProvider>
);