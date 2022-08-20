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
            disabledBackground: 'rgba(255,255,255,0.1)',
            disabled: "rgba(255,255,255,0.4)"
        },
        info: {
            main: lightTheme.palette.info.light,
            dark: "grey"
        },
        primary: {
            light: "#3f3e8b",
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
})

darkTheme = createTheme(darkTheme, {
    typography: {
        ...typographyStyle,
    },

    components: {
        ...commonMuiComponentStyles,
        MuiDivider: {
            styleOverrides: {
                root: {
                    backgroundColor: darkTheme.palette.secondary.main
                }
            }
        },
        // MuiCheckbox: {
        //     styleOverrides: {
        //         root: {
        //             color: "#4a7197"
        //         }
        //     }
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
                    borderRadius: "12px",

                    "&.blur": {
                        boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.05)",
                    },
                    "&.glow": {
                        boxShadow: `0px 2px 15px rgba(0, 0, 0, 0.2)`
                    }
                },

            }
        },
        MuiTypography: {
            styleOverrides: {
                caption: {
                    color: 'green'
                },
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
                    borderRadius: "12px",
                    "& .MuiInputBase-inputSizeSmall": {
                        boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.04)",
                        border: "solid 1px rgba(255, 255, 255, 0.25)",
                        borderRadius: "12px",
                    },
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: "#8D8D8D"
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    // backgroundColor: "rgba(120, 120, 120, 0.2)"
                }
            }
        },
        MuiCalendarPicker: {
            styleOverrides: {
                root: {
                    "& .MuiTypography-caption": {
                        color: "white"
                    },
                    "& .MuiIconButton-root.Mui-disabled": {
                        "& .MuiSvgIcon-root": {
                          color: darkTheme.palette.background.default
                        },
                    },
                    backgroundColor:  darkTheme.palette.background.default,
                },
            }
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    color: darkTheme.palette.secondary.main,
                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                icon: {
                    color: darkTheme.palette.secondary.main,
                }
            }
        },
        MuiPickersDay: {
          styleOverrides: {
              root: {
                  // backgroundColor: "green"
              },
              dayWithMargin: {
                  backgroundColor: darkTheme.palette.primary.light
              },
              selectedDays: {
                  backgroundColor: "red"
              }
          }
        },
    },
})
//teasing-near-the-plumper-4/