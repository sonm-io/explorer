import { Transaction } from "src/types/Transaction";
import PagedList, { IListState } from "./generic/paged-list";
import Fetch, { IFetchCtl, IFetchConfig } from "./generic/fetch-store";
import { History } from 'history';
import { Store } from "unistore";

// Interfaces

export type TTransactionsShow = 'transactions' | 'token-trns';

export interface ITransactions {
    addressInfo?: {
        balanceSnm: string;
        balanceUsd: string;
    };
    // filter:
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
    fetchAddressBalance: (address: string) => Promise<[string, string]>,
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
        getArgs: (state: ITransactionsState) => (['', state.address]), // show, address
        updateStore: PagedList.updateCount,
    };
    const state: ITransactionsState = {
        ...PagedList.initState(),
        show: 'transactions',
        date: undefined,
    };

    const controller = Fetch.init(state, fetchDataCfg, fetchCountCfg, history);

    const actions = (store: Store<ITransactionsState>) => ({
        ...controller.actions(store),
        update: async (state: ITransactionsState, upd: Pick<ITransactionsState, keyof ITransactionsState>, overwrite: boolean = false, withCount: boolean = true) => {
            controller.actions(store).update(state, upd, overwrite, withCount);
            if (state.address !== undefined) {
                const balanceResult = await fetchAddressBalance(state.address);
                store.setState({ addressInfo: { balanceSnm: balanceResult[0], balanceUsd: balanceResult[1] } });
            } else {
                store.setState({ addressInfo: undefined });
            }
        },
    });

    return {
        store: controller.store,
        actions,
        boundedActions: Fetch.getBoundActs(controller.store, actions(controller.store)),
    };
};

export default {
    init,
};
