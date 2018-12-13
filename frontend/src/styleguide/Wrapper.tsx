import * as React from 'react';
import { theme } from "../theme";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import { Router } from 'react-router';
import createBrowserHistory from "history/createBrowserHistory";
const history = createBrowserHistory();

export default class Wrapper extends React.Component {
    public render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Router history={history}>
                    {this.props.children}
                </Router>
            </MuiThemeProvider>
        );
    }
}
