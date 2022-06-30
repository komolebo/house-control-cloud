import {createTheme, makeStyles} from "@mui/material";
import {inspect} from "util";

export let theme = createTheme({});

theme = createTheme(theme, {
    palette: {
        success: {
            main: theme.palette.success.light,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 47,
                    height: 42
                }
            }
        }
    },
    typography: {
        button: {
            textTransform: "none"
        }
    }
});

