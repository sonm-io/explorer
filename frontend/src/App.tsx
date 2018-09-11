import * as React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import './App.css';
import {Home} from "./components/home/Home";
import {Blocks} from "./components/blocks/Blocks";
import {Block} from "./components/block/Block";
import {Transactions} from "./components/transactions/Transactions";
import {Transaction} from "./components/transaction/Transaction";
import {Address} from "./components/address/Address";
import {Header} from "./components/header/Header";
import Grid from "@material-ui/core/Grid/Grid";


class App extends React.Component {
    public render() {
        return (
            <div className="App">
                <Router>
                    <div>
                        <Header/>
                        <Grid container direction="column" justify="flex-start" alignItems="center">
                            <Route exact path="/" component={Home}/>
                            <Route path="/blocks" component={Blocks}/>
                            <Route path="/block/:blockHash" component={Block}/>
                            <Route path="/transactions" component={Transactions}/>
                            <Route path="/transaction/:txHash" component={Transaction}/>
                            <Route path="/address/:address" component={Address}/>
                        </Grid>
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;
