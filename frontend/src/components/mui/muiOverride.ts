import {createTheme} from "@mui/material";

export let theme = createTheme({});

theme = createTheme(theme, {
    palette: {
        success: {
            main: theme.palette.success.light,
        },
        info: {
            main: theme.palette.info.light
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 47,
                    height: 42
                }
            },
            variants: [
                {
                    props: { size: 'xlow' },
                    style: {
                        height: '24px'
                    },
                },
            ],
        },
    },
    typography: {
        button: {
            textTransform: "none"
        }
    }
});
