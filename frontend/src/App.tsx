import * as React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Home from "./components/home/Home";
import BlocksPage from "./components/blocks/BlocksPage";
import BlockPage from "./components/block/BlockPage";
import TransactionsPage from "./components/transactions/TransactionsPage";
import TransactionPage from "./components/transaction/TransactionPage";
import AddressPage from "./components/address/AddressPage";
import Header from "./components/header/Header";
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
                <Router forceRefresh={true}>
                    <div className="App">
                        <Header classes={{
                            search: "search",
                            searchIcon: "searchIcon",
                            inputRoot: "inputRoot",
                            inputInput: "inputInput"
                        }}/>
                        <Switch>
                            <Route exact path="/" component={Home}/>
                            <Route path="/blocks" component={BlocksPage}/>
                            <Route exact path="/block/:blockHash" component={BlockPage}/>
                            <Route path="/transactions" component={TransactionsPage}/>
                            <Route path="/transaction/:txHash" component={TransactionPage}/>
                            <Route path="/address/:address" component={AddressPage}/>
                        </Switch>
                    </div>
                </Router>
            </MuiThemeProvider>
        );
    }
}

export default App;
