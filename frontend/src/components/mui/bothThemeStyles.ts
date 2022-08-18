export const commonMuiComponentStyles = {
    MuiInputBase: {
        styleOverrides: {
            input: {
                '&:-webkit-autofill': {
                    transitionDelay: '9999s',
                    transitionProperty: 'background-color, color',
                },
            },
        },
    },
}
export const typographyStyle = {
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
