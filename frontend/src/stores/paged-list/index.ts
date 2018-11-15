import createStore, { Store } from 'unistore';
import { IListState } from './types';

type TFetch<TItem> = (page: number, pageSize: number) => Promise<TItem[] | string>;

const initStore = <TItem>(pageSize = 10, page = 1): Store<IListState<TItem>> => {
    const list: TItem[] = [];
    return createStore({
        list,
        loading: false,
        pageSize,
        page,
    });
};

class Actions<TItem> {
    constructor(
        fetchMethod: TFetch<TItem>,
        store: Store<IListState<TItem>>
    ) {
        this.fetchMethod = fetchMethod;
        this.store = store;
    }

    private fetchMethod: TFetch<TItem>;
    private store: Store<IListState<TItem>>;

    public changePageSize = async (_: any, pageSize: number): Promise<void> => {
        this.store.setState({ pageSize });
        this.fetch(this.store.getState());
    }

    public fetch = async (state: IListState<TItem>, page?: number) => {
        this.store.setState({ loading: true });
        const p = page === undefined ? 1 : page;
        const result = await this.fetchMethod(p, state.pageSize);
        const upd = typeof(result) === 'string'
            ? { error: undefined }
            : { list: result };
        const update: Pick<IListState<TItem>, 'loading' | 'page'> = {
            loading: false,
            page: p,
            ...upd,
        };
        this.store.setState(update);
    }
}

const initActions = <TItem>(fetchMethod: TFetch<TItem>) =>
    (store: Store<IListState<TItem>>) =>
    new Actions(fetchMethod, store);

export default {
    initStore,
    initActions,
};
