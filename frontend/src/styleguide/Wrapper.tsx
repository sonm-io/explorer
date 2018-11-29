import * as React from 'react';
import { theme } from "../theme";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";

export default class Wrapper extends React.Component {
    public render() {
        return (
            <MuiThemeProvider theme={theme}>
                {this.props.children}
            </MuiThemeProvider>
        );
    }
}
