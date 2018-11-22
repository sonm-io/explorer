import createStore, { Store } from 'unistore';
import { IController } from './common';
import Pending, { pending, IPendingState } from './features/pending';
import Notifications, { INotificationsState, INotificationsActions } from './features/notifications';

export interface IListState<TItem> extends IPendingState, INotificationsState {
    list: TItem[];
    error?: string; // ToDo: remove
    loading: boolean; // ToDo: remove
    pageSize: number;
    page: number;
}

export interface IListActions<TItem> extends INotificationsActions {
    changePageSize: (state: IListState<TItem>, pageSize: number) => Promise<void>;
    fetch: (state: IListState<TItem>, page?: number) => Promise<void>;
}

interface IBoundedActions {
    fetch: (page?: number) => void;
}

export type TFetchPage<TItem> = (page: number, pageSize: number) => Promise<TItem[] | string>;

export interface IPagedListBoundActions {
    fetch: (page?: number) => void;
}

export type IPagedListCtl<TItem> = IController<
    IListState<TItem>,
    IListActions<TItem>,
    IPagedListBoundActions
>;

export const initState = <TItem>(pageSize = 10, page = 1): IListState<TItem> => {
    const pendingState = Pending.initState();
    const notificationsState = Notifications.initState();
    const list: TItem[] = [];
    return {
        ...pendingState,
        ...notificationsState,
        list,
        loading: false,
        pageSize,
        page,
    };
};

export const initStore = <TItem>(pageSize = 10, page = 1): Store<IListState<TItem>> =>
    createStore(initState(pageSize, page));

const fetchPage = <TItem>(fetchMethod: TFetchPage<TItem>, store: Store<IListState<TItem>>) => {
    const fn = async (state: IListState<TItem>, page?: number) => {
        console.log(`page: ${page}`);
        const p = page === undefined ? 1 : page;
        const result = await fetchMethod(p, state.pageSize);
        const notif = [...state.notifications];
        const upd: Pick<IListState<TItem>, any> = typeof(result) === 'string'
            ? { error: result }
            : { list: result, page: p, notifications: notif };
        store.setState(upd);
    };
    return pending(store, fn);
};

export const initActions = <TItem>(fetchMethod: TFetchPage<TItem>) =>
    (store: Store<IListState<TItem>>): IListActions<TItem> => ({
        ...Notifications.actions(store),
        changePageSize: async (_: any, pageSize: number): Promise<void> => {
            store.setState({ pageSize });
            fetchPage(fetchMethod, store)(store.getState());
        },
        fetch: fetchPage(fetchMethod, store),
    });

export const getBoundActions = <TItem>(
    store: Store<IListState<TItem>>,
    actions: (store: Store<IListState<TItem>>) => IListActions<TItem>
): IBoundedActions => {
    const fetchAct = store.action(actions(store).fetch);
    return {
        fetch: (page?: number) => fetchAct(page),
    };
};

// export const getFeatureConfig = <TItem>(
//     fetchMethod: TFetchPage<TItem>,
//     pageSize?: number
// ): IFeatureConfig<IListState<TItem>, IListActions<TItem>, IBoundedActions> => ({
//     initialState: initState<TItem>(pageSize),
//     actions: initActions<TItem>(fetchMethod),
//     getBoundActions,
// });

export const init = <TItem>(
    fetchMethod: TFetchPage<TItem>,
    pageSize?: number
): IPagedListCtl<TItem> => {
    const store = initStore<TItem>(pageSize);
    const actions = initActions<TItem>(fetchMethod);
    return {
        store,
        actions,
        boundedActions: getBoundActions(store, actions),
    };
};
