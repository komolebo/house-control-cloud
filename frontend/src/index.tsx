import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {ModalProvider} from "./components/popup/ModalProvider";


ReactDOM.render(
    <ModalProvider>
    <App/>
    </ModalProvider>,
    document.getElementById('root')

);