import {createTheme} from "@mui/material";
import type {} from '@mui/x-date-pickers/themeAugmentation';

export let lightTheme = createTheme({});
export let darkTheme = createTheme({});

const typographyStyle = {
    button: {
        textTransform: "none"
    },
    fontFamily: "Roboto Light, 'Roboto', sans-serif",
    h1: {
        fontSize: 32,
        fontWeight: 600,
        // color: "red"
    },
    h2: {
        fontSize: 20,
        fontWeight: 300,
        // color: "red"
    },
    hb2: {
        fontSize: 20,
        fontWeight: 600,
        // color: "red"
    },
    h3: {
        fontSize: 18,
        fontWeight: 300,
        // color: "red"
    },
    h4: {
        fontSize: 18,
        fontWeight: 600,
        // color: "red"
    },
    h5: {
        fontSize: 14,
        fontWeight: 400,
    },
    h6: {
        fontSize: 14,
        fontWeight: 300,
        lineHeight: "16px"
    }
};

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
        // MuiDatePicker: {
        //     styleOverrides: {
        //         root: {
        //             backgroundColor: 'red',
        //         },
        //     },
        // },
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
                    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.15)",
                    borderRadius: "15px",

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
