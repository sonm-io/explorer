import * as React from "react";
import { Route, Switch, RouteComponentProps, withRouter } from "react-router-dom";
import NotFound from "./components/elements/errors/NotFound";
import { BlockPage } from "./components/pages/block/BlockPage";
import { BlocksPage } from "./components/pages/blocks/BlocksPage";
import ContractsPage from "./components/pages/contracts/ContractsPage";
import HomePage from "./components/pages/home";
import { TransactionPage } from "./components/pages/transaction/TransactionPage";
import { TransactionsPage } from "./components/pages/transactions/TransactionsPage";
import { createListPage } from 'src/components/factories/list';
import RouterDebugger from 'src/components/generic/RouterDebugger';
import RootStore from 'src/stores/root';
import { createItemPage } from "src/components/factories/item";
import Header from "./components/elements/header";

const BlockLayout = createItemPage(BlockPage, RootStore.block);
const TransactionLayout = createItemPage(TransactionPage, RootStore.transaction);
const BlocksLayout = createListPage(BlocksPage, RootStore.blocks);
const TransactionsLayout = createListPage(TransactionsPage, RootStore.transactions);

class App extends React.Component<RouteComponentProps> {

    public render() {
        return (
            <div className="App">
                <RouterDebugger/>
                <Header />
                <Switch>
                    <Route exact path="/" component={HomePage}/>
                    <Route path="/blocks" render={(p) => {
                        RootStore.blocks.boundedActions.update({ page: 1 });
                        return <BlocksLayout/>;
                    }} />
                    <Route exact path="/block/:blockHash" render={(p) => {
                        const id = p.match.params.blockHash;
                        RootStore.block.boundedActions.update({ id });
                        return <BlockLayout />;
                    }}/>
                    <Route path="/transactions" render={(p) => {
                        RootStore.transactions.boundedActions.update({ address: undefined, page: 1 });
                        return <TransactionsLayout />;
                    }}/>
                    <Route path="/transaction/:txHash" render={(p) => {
                        const id = p.match.params.txHash;
                        RootStore.transaction.boundedActions.update({ id });
                        return <TransactionLayout />;
                    }}/>
                    <Route
                        path="/address/:address"
                        render={(p) => {
                            const address: string = p.match.params.address;
                            RootStore.transactions.boundedActions.update({ address, page: 1 });
                            return <TransactionsLayout />;
                        }}
                    />
                    <Route path="/contracts" component={ContractsPage}/>
                    <Route path="*" component={NotFound}/>
                </Switch>
            </div>
        );
    }
}

export default withRouter(App);
