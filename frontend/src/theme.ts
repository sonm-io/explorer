import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

export const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#757ce8',
            main: '#0b1d26',
            dark: '#002884',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ff7961',
            main: '#60dff4',
            dark: '#9c2cba',
            contrastText: '#fff',
        },
    },
});
