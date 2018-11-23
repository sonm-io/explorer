import PagedList, { IListState, IListFetchConfig, IListBoundActs, IListActions } from "./generic/paged-list";
import { Transaction } from "src/types/Transaction";
import { Store } from "unistore";
import { IController } from './common';
import createStore from 'unistore';

// Interfaces

export interface ITransactionsState extends IListState<Transaction> {
    address?: string;
}

export interface ITransactionsActions extends IListActions<Transaction> {
    changeAddress: (state: ITransactionsState, address?: string) => Promise<void>;
}

export type TTransactionsFetch = (page: number, pageSize: number, address?: string) => Promise<Transaction[] | string>;

interface ITransactionsFetchConfig extends IListFetchConfig<
    Transaction,
    [number, number, string | undefined],
    Transaction[] | string
> {}

export interface ITransactionsBoundActs extends IListBoundActs {
    changeAddress: (address?: string) => void;
}

export type ITransactionsCtl = IController<ITransactionsState, ITransactionsActions, ITransactionsBoundActs>;

// Implementation

const initState: (pageSize?: number, page?: number) => ITransactionsState = PagedList.initState;

const initActions = (
    config: ITransactionsFetchConfig
) => {
    const pagedListActionsFactory = PagedList.initActions(config);
    return (store: Store<ITransactionsState>) => ({
        ...pagedListActionsFactory(store),
        changeAddress: async (state: ITransactionsState, address?: string) => {
            store.setState({ address });
            pagedListActionsFactory(store).fetch(state);
        },
    });
};

const getBoundedActions = (
    store: Store<ITransactionsState>,
    actions: (store: Store<ITransactionsState>) => ITransactionsActions
): ITransactionsBoundActs => ({
    changeAddress: store.action(actions(store).changeAddress),
    fetch: store.action(actions(store).fetch),
});

export const init = (
    fetchMethod: TTransactionsFetch
): ITransactionsCtl => {
    const store = createStore(initState());
    const transFetchCfg: ITransactionsFetchConfig = {
        fetchMethod,
        getArgs: (state: ITransactionsState) => ([state.page, state.pageSize, state.address]),
        updateStore: PagedList.updateListStore,
    };
    const actions = initActions(transFetchCfg);

    return {
        store,
        actions,
        boundedActions: getBoundedActions(store, actions),
    };
};

export default {
    init,
};
