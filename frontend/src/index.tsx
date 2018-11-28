import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import { theme } from "./theme";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import {BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <Router>
            <App />
        </Router>
    </MuiThemeProvider>,
    document.getElementById("root") as HTMLElement
);
registerServiceWorker();
