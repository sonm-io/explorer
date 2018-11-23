import createStore, { Store } from 'unistore';
import { IController } from './common';
import Fetch, { IFetchState, IFetchConfig } from './fetch-store';
import Notifications, { INotificationsActions } from './features/notifications';

// Interfaces

export interface IListState<TItem> extends IFetchState {
    list: TItem[];
    pageSize: number;
    page: number;
}

export interface IListActions<TItem> extends INotificationsActions {
    changePageSize: (state: IListState<TItem>, pageSize: number) => Promise<void>;
    fetch: (state: IListState<TItem>, page?: number) => Promise<void>;
}

export interface IListBoundActs {
    fetch: (page?: number) => void;
}

export interface IListFetchConfig<
    TItem,
    TFetchArgs extends any[],
    TFetchResult
> extends IFetchConfig<IListState<TItem>, TFetchArgs, TFetchResult> {}

export type IListCtl<TItem> = IController<
    IListState<TItem>,
    IListActions<TItem>,
    IListBoundActs
>;

// Implementation

export const initState = <TItem>(pageSize = 10, page = 1): IListState<TItem> => ({
    ...Fetch.initState(),
    list: [] as TItem[],
    pageSize,
    page,
});

export const getListArgs = <TItem>(
    state: IListState<TItem>
): [number, number] => ([state.page, state.pageSize]);

export const updateListStore = <TItem>(store: Store<IListState<TItem>>, result: TItem[] | string) => {
    if(typeof(result) === 'string') {
        Notifications.actions(store).addSnackbar(store.getState(), result);
    } else {
        store.setState({ list: result });
    }
};

const fetchPage = <TItem, TArgs extends any[], TRes>(
    config: IListFetchConfig<TItem,TArgs,TRes>,
    store: Store<IListState<TItem>>
) => async (state: IListState<TItem>, page?: number) => {
    const p = page === undefined ? 1 : page;
    store.setState({ page: p });
    Fetch.fetchData(config)(store)(state);
};

const initActions = <TItem, TArgs extends any[], TRes>(fetchConfig: IListFetchConfig<TItem,TArgs,TRes>) =>
    (store: Store<IListState<TItem>>): IListActions<TItem> => ({
        ...Notifications.actions(store),
        changePageSize: async (_: any, pageSize: number): Promise<void> => {
            store.setState({ pageSize });
            fetchPage(fetchConfig, store)(store.getState());
        },
        fetch: fetchPage(fetchConfig, store),
    });

const getBoundActions = <TItem>(
    store: Store<IListState<TItem>>,
    actions: (store: Store<IListState<TItem>>) => IListActions<TItem>
): IListBoundActs => ({
    fetch: store.action(actions(store).fetch),
});

export const init = <TItem, TArgs extends any[], TRes>(
    fetchConfig: IListFetchConfig<TItem,TArgs,TRes>,
    pageSize?: number
): IListCtl<TItem> => {
    const store = createStore(initState<TItem>(pageSize));
    const actions = initActions<TItem,TArgs,TRes>(fetchConfig);
    return {
        store,
        actions,
        boundedActions: getBoundActions(store, actions),
    };
};

export const initSimple = <TItem>(fetchMethod: (page: number, pageSize: number) => Promise<TItem[] | string>) =>
    init<TItem, [number, number], TItem[]|string>({
        fetchMethod,
        getArgs: getListArgs,
        updateStore: updateListStore,
    });

export default {
    initState,
    initActions,
    init,
    initSimple,
    getListArgs,
    updateListStore,
};
