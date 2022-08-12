import React from 'react';
import App from './App';
import {UserAuthProvider} from "./globals/UserAuthProvider";
import {createRoot} from "react-dom/client";


const rootEl = document.getElementById('root')
if (rootEl === null) throw new Error('Root container missing in index.html')

const root = createRoot(rootEl)
root.render(
    <UserAuthProvider>
        <App/>
    </UserAuthProvider>
);