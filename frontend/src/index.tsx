import * as React from "react";
import * as ReactDOM from "react-dom";
import JssProvider from 'react-jss/lib/JssProvider';
import { create } from 'jss';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import App from "src/components/app/App";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import { theme } from "./theme";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import { Router } from "react-router";
//import {BrowserRouter as Router } from "react-router-dom";
import RootStore from 'src/stores/root';

const generateClassName = createGenerateClassName();
const jss = create({
  ...jssPreset(),
  // We define a custom insertion point that JSS will look for injecting the styles in the DOM.
  insertionPoint: 'jss-insertion-point',
});

ReactDOM.render(
    <JssProvider jss={jss} generateClassName={generateClassName}>
        <MuiThemeProvider theme={theme}>
            <Router history={RootStore.navigation.history}>
                <App />
            </Router>
        </MuiThemeProvider>
    </JssProvider>,
    document.getElementById("root") as HTMLElement
);
registerServiceWorker();
