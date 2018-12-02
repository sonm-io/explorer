/**
 * Here Stores are connecting to API.
 */

import * as Api from 'src/api';
import ItemStore from './generic/item-store';
import PagedList from './generic/paged-list';
import Transactions from './transactions-store';
import Navigation from './navigation-store';
import { Block } from 'src/types/Block';

import createBrowserHistory from "history/createBrowserHistory";
const history = createBrowserHistory();

export default {
    transactions: Transactions.init(Api.transactions),
    transaction: ItemStore.init(Api.transaction),
    blocks: PagedList.initSimple<Block>(Api.blocks),
    block: ItemStore.init(Api.block),
    navigation: Navigation.init(history),
};
