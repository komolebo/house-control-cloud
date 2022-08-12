import {createTheme} from "@mui/material";

export let lightTheme = createTheme({});
export let darkTheme = createTheme({});

darkTheme = createTheme(darkTheme, {
    palette: {
        background: {
            default: "#222222"
        }
    }
})

lightTheme = createTheme(lightTheme, {
    palette: {
        success: {
            main: lightTheme.palette.success.light,
        },
        info: {
            main: lightTheme.palette.info.light
        },
        // mode: 'dark'
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

        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    // border: 'none',
                    backgroundColor: "white",
                    borderRadius: "6px",
                    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.04)",
                    border: "solid 0px rgba(0, 0, 0, 0.025)"
                }
            }
        },

        MuiMenuItem: {
            styleOverrides: {
                root: {
                    "&:hover, &.Mui-selected, &.Mui-selected:hover": {
                        backgroundColor: "#1690E9",
                        color: "white"
                    },
                    '& .MuiTypography-root': {
                        color: '#2F3542',
                    },
                    '&:hover .MuiTypography-root, &.Mui-selected .MuiTypography-root': {
                        color: "white",
                    },

                    color: "#1690E9",
                    borderBottom: "solid 1px rgba(0, 0, 0, 0.1)",
                    padding:  "8px 15px"
                }
            }
        },

        MuiTab: {
            styleOverrides: {
                root: {
                    fontFamily: "Roboto, 'Roboto', sans-serif",
                    fontSize: "18px",
                    fontStyle: "normal",
                    color: "#2F3542"
                }
            }
        }

    },
    typography: {
        button: {
            textTransform: "none"
        }
    },
});
