import * as unistore from 'unistore/react';
import { TCmpCtor } from 'src/types';
import { Store } from 'unistore';
import { ITransactionsPageProps } from './TransactionsPage';
import { ITransactionsState, ITransactionsActions, ITransactionsCtl } from 'src/stores/transactions-store';
import createRoot from 'src/components/root';

const connect = (
    actions: (store: Store<ITransactionsState>) => ITransactionsActions,
    Cmp: TCmpCtor<ITransactionsPageProps>
) => unistore.connect((s: Store<ITransactionsState>, a: any) => ({...s, ...a}), actions)(Cmp);

export const createPage = (
    Cmp: TCmpCtor<ITransactionsPageProps>,
    controller: ITransactionsCtl
) => {
    const ConnectedCmp = connect(controller.actions, Cmp);
    const fetch1stPage = () => controller.boundedActions.fetch && controller.boundedActions.fetch(1);
    return createRoot(controller.store, ConnectedCmp, fetch1stPage);
};
