import createStore, { Store } from 'unistore';
import { IController } from './common';
import { pending, IPending } from './mixins/pending';

export interface IListState<TItem> extends IPending {
    list: TItem[];
    error?: string;
    loading: boolean; // ToDo: remove
    pageSize: number;
    page: number;
}

export interface IListActions<TItem> {
    changePageSize: (state: IListState<TItem>, pageSize: number) => Promise<void>;
    fetch: (state: IListState<TItem>, page?: number) => Promise<void>;
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
    const list: TItem[] = [];
    return {
        pendingSet: new Map<number, boolean>(),
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
        const p = page === undefined ? 1 : page;
        const result = await fetchMethod(p, state.pageSize);
        const upd: Pick<IListState<TItem>, any> = typeof(result) === 'string'
            ? { error: undefined }
            : { list: result };
        store.setState(upd);
    };
    return pending(store, fn);
};

export const initActions = <TItem>(fetchMethod: TFetchPage<TItem>) =>
    (store: Store<IListState<TItem>>) => ({
        changePageSize: async (_: any, pageSize: number): Promise<void> => {
            store.setState({ pageSize });
            fetchPage(fetchMethod, store)(store.getState());
        },
        fetch: fetchPage(fetchMethod, store),
    });

export const init = <TItem>(
    fetchMethod: TFetchPage<TItem>,
    pageSize?: number
): IPagedListCtl<TItem> => {
    const store = initStore<TItem>(pageSize);
    const actions = initActions(fetchMethod);
    const fetchAct = store.action(actions(store).fetch);
    return {
        store,
        actions,
        boundedActions: {
            fetch: (page?: number) => {
                fetchAct(page);
            },
        },
    };
};
