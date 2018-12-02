import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import { theme } from "./theme";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import { Router } from "react-router";
//import {BrowserRouter as Router } from "react-router-dom";
import RootStore from 'src/stores/root';

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <Router history={RootStore.navigation.history}>
            <App />
        </Router>
    </MuiThemeProvider>,
    document.getElementById("root") as HTMLElement
);
registerServiceWorker();
