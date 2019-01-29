import * as React from "react";
import {Route, RouteComponentProps, Switch, withRouter} from "react-router-dom";
import NotFound from "src/components/elements/errors/NotFound";
import {BlockPage} from "src/components/pages/block/BlockPage";
import {BlocksPage} from "src/components/pages/blocks/BlocksPage";
import ContractsPage from "src/components/pages/contracts/ContractsPage";
import HomePage from "src/components/pages/home";
import {TransactionPage} from "src/components/pages/transaction/TransactionPage";
import {TransactionsPage} from "src/components/pages/transactions/TransactionsPage";
import {createListPage} from 'src/components/factories/list';
import RouterDebugger from 'src/components/generic/RouterDebugger';
import RootStore from 'src/stores/root';
import {createItemPage} from "src/components/factories/item";
import PageHeader from "src/components/elements/page-header";
import './app.less';
import {TNavigationMenus} from "src/stores/navigation-store";
import Footer from "../elements/footer";

const BlockLayout = createItemPage(BlockPage, RootStore.block);
const TransactionLayout = createItemPage(TransactionPage, RootStore.transaction);
const BlocksLayout = createListPage(BlocksPage, RootStore.blocks);
const TransactionsLayout = createListPage(TransactionsPage, RootStore.transactions);

const paths: { [p: string]: TNavigationMenus } = {
    '/': 'home',
    '/transactions': 'transactions',
    '/blocks': 'blocks',
    '/contracts': 'contracts'
};

class App extends React.Component<RouteComponentProps> {

    private setActiveMenu() {
        const loc = this.props.location.pathname;
        RootStore.navigation.store.setState({activeMenu: paths[loc]});
    }

    private renderContent = () =>
        <div className="app__content">
            <Switch>
                <Route exact path="/" component={HomePage}/>
                <Route path="/blocks" render={(p) => {
                    RootStore.blocks.boundedActions.update({page: 1}, { withCount: true });
                    return <BlocksLayout/>;
                }}/>
                <Route exact path="/block/:num" render={(p) => {
                    const num = p.match.params.num;
                    RootStore.block.boundedActions.update({id: num});
                    return <BlockLayout/>;
                }}/>
                <Route path="/transactions/block-:block" render={(p) => {
                    const block = p.match.params.block;
                    RootStore.transactions.boundedActions.update({address: undefined, block, page: 1}, { withCount: true });
                    return <TransactionsLayout/>;
                }}/>
                <Route path="/transactions" render={(p) => {
                    RootStore.transactions.boundedActions.update({address: undefined, block: undefined, page: 1}, { withCount: true });
                    return <TransactionsLayout/>;
                }}/>
                <Route path="/transaction/:txHash" render={(p) => {
                    const id = p.match.params.txHash;
                    RootStore.transaction.boundedActions.update({id});
                    return <TransactionLayout/>;
                }}/>
                <Route
                    path="/address/:address/:show?"
                    render={(p) => {
                        const address: string = p.match.params.address;
                        const show = p.match.params.show;
                        RootStore.transactions.boundedActions.update({
                            address,
                            page: 1,
                            show: show || 'transactions',
                        }, { withCount: true });
                        return <TransactionsLayout/>;
                    }}
                />
                <Route path="/contracts" component={ContractsPage}/>
                <Route path="*" component={NotFound}/>
            </Switch>
        </div>

    public render() {
        this.setActiveMenu(); // ToDo: is it correct place to this?
        return (
            <div className="app">
                <RouterDebugger/>
                <PageHeader/>
                {this.renderContent()}
                <Footer/>
            </div>
        );
    }
}

export default withRouter(App);
