import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {ModalProvider} from "./components/modals/ModalProvider";
import {ThemeProvider} from "@mui/material";
import {theme} from "./components/mui/muiOverride";

declare module '@mui/material/styles' {
    interface Palette {
        neutral: Palette['primary'];
    }

    // allow configuration using `createTheme`
    interface PaletteOptions {
        neutral?: PaletteOptions['primary'];
    }
}

// Update the Button's color prop options
declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        neutral: true;
    }
}

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <ModalProvider>
            <App/>
        </ModalProvider>
    </ThemeProvider>,
    document.getElementById('root')
);