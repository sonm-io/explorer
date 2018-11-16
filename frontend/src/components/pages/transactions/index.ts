import { TransactionsPage } from './TransactionsPage';
import { createListPage } from 'src/components/list';
import * as Api from 'src/api';

export default () => createListPage(TransactionsPage, Api.transactions);
