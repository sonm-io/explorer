/**
 * Here Stores are connecting to API.
 */

import * as Api from 'src/api';
import PagedList from './paged-list3';
import Transactions from './transactions-store';
import { Block } from 'src/types/Block';

export default {
    transactions: Transactions.init(Api.transactions),
    blocks: PagedList.initSimple<Block>(Api.blocks),
};
