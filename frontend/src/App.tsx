import * as React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import NotFound from "./components/errors/NotFound";
import Header from "./components/header/Header";
import AddressPage from "./components/pages/address/AddressPage";
import BlockPage from "./components/pages/block/BlockPage";
import BlocksPage from "./components/pages/blocks/BlocksPage";
import ContractsPage from "./components/pages/contracts/ContractsPage";
import HomePage from "./components/pages/home/HomePage";
import TransactionPage from "./components/pages/transaction/TransactionPage";
import TransactionsPage from "./components/pages/transactions/TransactionsPage";
import {theme} from "./theme";

export const ENDPOINT = "http://127.0.0.1:3544";

class App extends React.Component {
    public render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Router forceRefresh={true}>
                    <div className="App">
                        <Header/>
                        <Switch>
                            <Route exact path="/" component={HomePage}/>
                            <Route path="/blocks" component={BlocksPage}/>
                            <Route exact path="/block/:blockHash" component={BlockPage}/>
                            <Route path="/transactions" component={TransactionsPage}/>
                            <Route path="/transaction/:txHash" component={TransactionPage}/>
                            <Route path="/address/:address" component={AddressPage}/>
                            <Route path="/contracts" component={ContractsPage}/>
                            <Route path="*" component={NotFound}/>
                        </Switch>
                    </div>
                </Router>
            </MuiThemeProvider>
        );
    }
}

export default App;
