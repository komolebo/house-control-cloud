import {createTheme} from "@mui/material";
import {lightTheme} from "./lightThemeStyle";
import {commonMuiComponentStyles, typographyStyle} from "./bothThemeStyles";

export let darkTheme = createTheme ({});

darkTheme = createTheme(darkTheme, {
    palette: {
        background: {
            default: "#141432"
        },
        action: {
            disabledBackground: '#404040',
            disabled: '#9e9e9e'
        },
        info: {
            main: lightTheme.palette.info.light
        },
        primary: {
            // main: "#1B1A43"
        },
        secondary: {
            main: "#8D8D8D"
        },
        text: {
            primary: "#FFFFFF"
        },
        special: {
            main: "#1B1A43"
        }
    },
    typography: {
        ...typographyStyle,
    },

    components: {
        ...commonMuiComponentStyles,
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: "#4a7197"
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

                    color: "#a5a5a5",
                    backgroundColor: '#1B1A43', //"#141432",
                    borderBottom: "solid 1px rgba(0, 0, 0, 0.1)",
                    padding:  "8px 15px",
                    margin: 0
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    // backgroundColor: "#141432",
                    backgroundColor: "#1B1A43",
                    boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.05)",
                    borderRadius: "12px",
                }
            }
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    color: "#bababa",
                },
            }
        },
        MuiAppBar: {
            styleOverrides: {
                colorPrimary: {
                    backgroundColor: "#1B1A43"
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
                    backgroundColor: "#26245e",
                    borderRadius: "6px",
                    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.04)",
                    border: "solid 1px rgba(255, 255, 255, 0.25)",
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: "#8D8D8D"
                }
            }
        }
    }
})
