import { BlocksPage } from './BlocksPage';
import { createListPage } from 'src/components/list';
import * as Api from 'src/api';

export default () => createListPage(BlocksPage, Api.blocks);
