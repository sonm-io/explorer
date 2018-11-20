import createStore, { Store } from 'unistore';
import { IController, StoreActionsBase } from './common';

export interface IListState<TItem> {
    list: TItem[];
    error?: string;
    loading: boolean;
    pageSize: number;
    page: number;
}

export interface IListActions {
    changePageSize: (pageSize: number) => Promise<void>;
    fetch: (page?: number) => Promise<void>;
}

export type TFetchPage<TItem> = (page: number, pageSize: number) => Promise<TItem[] | string>;

export interface IPagedListBoundActions {
    fetch: (page?: number) => void;
}

export type IPagedListCtl<TItem> = IController<
    IListState<TItem>,
    PagedListActions<TItem, IListState<TItem>>,
    IPagedListBoundActions
>;

export const initState = <TItem>(pageSize = 10, page = 1): IListState<TItem> => {
    const list: TItem[] = [];
    return {
        list,
        loading: false,
        pageSize,
        page,
    };
};

export const initStore = <TItem>(pageSize = 10, page = 1): Store<IListState<TItem>> =>
    createStore(initState(pageSize, page));

export class PagedListActions<TItem, TState extends  IListState<TItem>> extends StoreActionsBase {
    constructor(
        fetchMethod: TFetchPage<TItem>,
        store: Store<TState>
    ) {
        super();
        this.fetchMethod = fetchMethod;
        this.store = store;
    }

    protected fetchMethod: TFetchPage<TItem>;
    protected store: Store<TState>;

    public changePageSize = async (_: any, pageSize: number): Promise<void> => {
        this.store.setState({ pageSize });
        this.fetch(this.store.getState());
    }

    public fetch = async (state: IListState<TItem>, page?: number) => {
        const p = page === undefined ? 1 : page;
        this.store.setState({ loading: true, page: p });
        const result = await this.fetchMethod(p, state.pageSize);
        console.log('PagedList / fetch');
        console.log(result);
        const upd: Pick<IListState<TItem>, any> = typeof(result) === 'string'
            ? { error: undefined }
            : { list: result };
        const update: Pick<IListState<TItem>, 'loading'> = {
            loading: false,
            ...upd,
        };
        this.store.setState(update);
    }
}

export const initActions = <TItem>(fetchMethod: TFetchPage<TItem>) =>
    (store: Store<IListState<TItem>>) =>
    new PagedListActions(fetchMethod, store);

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
