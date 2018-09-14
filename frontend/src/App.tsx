import * as React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import {Home} from "./components/home/Home";
import {Blocks} from "./components/blocks/Blocks";
import {Block} from "./components/block/Block";
import {Transactions} from "./components/transactions/Transactions";
import {Transaction} from "./components/transaction/Transaction";
import {Address} from "./components/address/Address";
import Header from "./components/header/Header";
import Grid from "@material-ui/core/Grid/Grid";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";


const theme = createMuiTheme({
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

class App extends React.Component {
    public render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Router>
                    <div className="App">
                        <Header classes={{
                            search: "search",
                            searchIcon: "searchIcon",
                            inputRoot: "inputRoot",
                            inputInput: "inputInput"
                        }}/>
                        <Grid container direction="column" justify="flex-start" alignItems="center">
                            <Switch>
                                <Route exact path="/" component={Home}/>
                                <Route path="/blocks" component={Blocks}/>
                                <Route path="/block/:blockHash" component={Block}/>
                                <Route path="/transactions" component={Transactions}/>
                                <Route path="/transaction/:txHash" component={Transaction}/>
                                <Route path="/address/:address" component={Address}/>
                            </Switch>
                        </Grid>
                    </div>
                </Router>
            </MuiThemeProvider>
        );
    }
}

export default App;
