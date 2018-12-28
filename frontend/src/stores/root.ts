/**
 * Here Stores are connecting to API.
 */

import Api from 'src/api';

import ItemStore from './generic/item-store';
import Blocks from './blocks-store';
import Transactions from './transactions-store';
import Navigation from './navigation-store';
import Footer from './footer-store';

import createBrowserHistory from "history/createBrowserHistory";
const history = createBrowserHistory();

export default {
    transactions: Transactions.init(Api.transactions, Api.transactionsCount, history),
    transaction: ItemStore.init(Api.transaction),
    blocks: Blocks.init(Api.blocks),
    block: ItemStore.init(Api.block),
    navigation: Navigation.init(history),
    footer: Footer.init(Api.footer)
};
