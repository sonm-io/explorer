import { Transaction } from "src/types/Transaction";
import PagedList, { IListState } from "./generic/paged-list";
import Fetch, { IFetchCtl, IFetchConfig } from "./generic/fetch-store";
import { History } from 'history';

// Interfaces

export type TTransactionsShow = 'transactions' | 'token-trns';

export interface ITransactions {
    address?: string;
    show: TTransactionsShow;
}

export interface ITransactionsState extends ITransactions, IListState<Transaction> {}

export type TTransactionsFetch = (page: number, pageSize: number, address?: string) => Promise<Transaction[] | string>;

interface ITransactionsFetchConfig extends IFetchConfig<
    ITransactionsState,
    [number, number, string, string | undefined],
    Transaction[] | string
> {}

// Implementation

const getRoute = (state: ITransactionsState) => {
    if (state.address !== undefined) {
        return `/address/${state.address}/${state.show}`;
    } else {
        return '/transactions';
    }
};

export const init = (
    fetchMethod: TTransactionsFetch,
    history: History
): IFetchCtl<ITransactionsState> => {
    const fetchConfig: ITransactionsFetchConfig = {
        fetchMethod,
        getArgs: (state: ITransactionsState) => ([state.page, state.pageSize, state.show, state.address]),
        updateStore: PagedList.updateListStore,
        getRoute,
    };
    const state: ITransactionsState = {
        ...PagedList.initState(),
        show: 'transactions',
    };
    return Fetch.init(state, fetchConfig, history);
};

export default {
    init,
};
