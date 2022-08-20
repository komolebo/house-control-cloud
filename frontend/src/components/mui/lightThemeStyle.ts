import {createTheme} from "@mui/material";
import {commonMuiComponentStyles, typographyStyle} from "./bothThemeStyles";
import {darkTheme} from "./darkThemeStyle";

export let lightTheme = createTheme ({});

lightTheme = createTheme(lightTheme, {
    palette: {
        success: {
            main: lightTheme.palette.success.light,
        },
        info: {
            main: lightTheme.palette.info.light
        },
        secondary: {
            main: "#2F3542"
        },
        text: {
            primary: "#2F3542"
        },
        special: {
            main: "#FAFAFB"
        },
        primary: {
            light: "#dce8fd"
        }
    },
})

lightTheme = createTheme(lightTheme, {
    components: {
        ...commonMuiComponentStyles,
        MuiDivider: {
            styleOverrides: {
                root: {
                    backgroundColor: lightTheme.palette.secondary.main
                }
            }
        },
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
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: "white",
                    boxShadow: "",
                    borderRadius: "15px",

                    "&.blur": {
                        boxShadow: `0 0px 15px rgba(0, 0, 0, 0.15)`
                    },
                    "&.glow": {
                        boxShadow: `0 2px 25px ${lightTheme.palette.primary.light}`
                    }
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
        ...typographyStyle
    }
});
