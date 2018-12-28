import { Transaction } from "src/types/Transaction";
import PagedList, { IListState } from "./generic/paged-list";
import Fetch, { IFetchCtl, IFetchConfig } from "./generic/fetch-store";
import { History } from 'history';

// Interfaces

export type TTransactionsShow = 'transactions' | 'token-trns';

export interface ITransactions {
    address?: string;
    show: TTransactionsShow;
    date?: Date;
    block?: number;
}

export interface ITransactionsState extends ITransactions, IListState<Transaction> {}

// ToDo: this signature doesn't correspond API method and there is no error message.
export type TTransactionsFetch = (page: number, pageSize: number, address?: string) => Promise<Transaction[] | string>;

export type TTransactionsFetchCount = (show: string, address?: string) => Promise<[{count: number}]>;

interface ITransactionsFetchConfig extends IFetchConfig<
    ITransactionsState,
    [number, number, string, string?, number?],
    Transaction[] | string
> {}

interface ITransactionsFetchCountConfig extends IFetchConfig<
    ITransactionsState,
    [string, string?], // show, address
    [{count: number}]
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
    fetchDataMethod: TTransactionsFetch,
    fetchCountMethod: TTransactionsFetchCount,
    history: History
): IFetchCtl<ITransactionsState> => {
    const fetchDataCfg: ITransactionsFetchConfig = {
        fetchMethod: fetchDataMethod,
        getArgs: (state: ITransactionsState) => ([state.page, state.pageSize, state.show, state.address, state.block]),
        updateStore: PagedList.updateListStore,
        getRoute,
    };
    const fetchCountCfg: ITransactionsFetchCountConfig = {
        fetchMethod: fetchCountMethod,
        getArgs: (state: ITransactionsState) => (['', state.address]),
        updateStore: PagedList.updateCount,
    };
    const state: ITransactionsState = {
        ...PagedList.initState(),
        show: 'transactions',
        date: undefined,
    };
    return Fetch.init(state, fetchDataCfg, fetchCountCfg, history);
};

export default {
    init,
};
