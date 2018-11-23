import * as React from "react";
import {BrowserRouter as Router, Route, Switch } from "react-router-dom";

import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import NotFound from "./components/errors/NotFound";
import Header from "./components/header/Header";
import { BlockPage } from "./components/pages/block/BlockPage";
import { BlocksPage } from "./components/pages/blocks/BlocksPage";
import ContractsPage from "./components/pages/contracts/ContractsPage";
import HomePage from "./components/pages/home/HomePage";
import { TransactionPage } from "./components/pages/transaction/TransactionPage";
import { TransactionsPage } from "./components/pages/transactions/TransactionsPage";
import {theme} from "./theme";
import { WithParams } from "./components/pages/test/WithParam";
import { createListPage } from 'src/components/list';
// import RouterDebugger from 'src/components/RouterDebugger';
import RootStore from 'src/stores/root';
import * as Transactions from 'src/components/pages/transactions';
import { createItemPage } from "./components/item";

const BlockLayout = createItemPage(BlockPage, RootStore.block);
const TransactionLayout = createItemPage(TransactionPage, RootStore.transaction);
const BlocksLayout = createListPage(BlocksPage, RootStore.blocks);
const TransactionsLayout = Transactions.createPage(TransactionsPage, RootStore.transactions);

class App extends React.Component {
    public render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Router>
                    <div className="App">
                        {/* <RouterDebugger/> */}
                        <Header/>
                        <Switch>
                            <Route exact path="/" component={HomePage}/>
                            <Route path="/blocks" component={BlocksLayout} />
                            <Route exact path="/block/:blockHash" render={(p) => {
                                const id = p.match.params.blockHash;
                                RootStore.block.boundedActions.fetch(id);
                                return <BlockLayout />;
                            }}/>
                            <Route path="/transactions" render={(p) => {
                                RootStore.transactions.boundedActions.changeAddress();
                                return <TransactionsLayout />;
                            }}/>
                            <Route path="/transaction/:txHash" render={(p) => {
                                const id = p.match.params.txHash;
                                RootStore.transaction.boundedActions.fetch(id);
                                return <TransactionLayout />;
                            }}/>
                            <Route
                                path="/address/:address"
                                render={(p) => {
                                    const address: string = p.match.params.address;
                                    RootStore.transactions.boundedActions.changeAddress(address);
                                    return <TransactionsLayout />;
                                }}
                            />
                            <Route path="/contracts" component={ContractsPage}/>
                            <Route
                                path="/test-with-params/:name,:age"
                                render={(p) =>
                                    <WithParams
                                        name={p.match.params.name}
                                        age={p.match.params.age}
                                    />
                                }
                            />
                            <Route path="*" component={NotFound}/>
                        </Switch>
                    </div>
                </Router>
            </MuiThemeProvider>
        );
    }
}

export default App;
