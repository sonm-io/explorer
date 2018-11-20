/**
 * Here Stores are connecting to API.
 */

import * as Api from 'src/api';
import * as PagedList from './paged-list2';
import * as Transactions from './transactions-store';

export default {
    transactions: Transactions.init(Api.transactions, Api.transactionsByAddress),
    blocks: PagedList.init(Api.blocks),
};
