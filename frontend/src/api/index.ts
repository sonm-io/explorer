import * as transactionsApi from './transactions-api';
import * as blocksApi from './blocks-api';

export default {
    ...transactionsApi,
    ...blocksApi
};
