import * as transactionsApi from './transactions-api';
import * as balanceApi from './balance-api';
import * as blocksApi from './blocks-api';
import footerApi from './footer-api';

export default {
    ...transactionsApi,
    ...blocksApi,
    ...balanceApi,
    footer: footerApi,
};
