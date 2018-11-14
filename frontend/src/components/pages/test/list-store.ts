import createStore, { Store } from 'unistore';
import { IListState } from './list-types';

type TFetch<TItem> = (page: number, pageSize: number) => Promise<TItem[]>;

export const initStore = <TItem>(pageSize = 20, page = 1): Store<IListState<TItem>> => {
    const list: TItem[] = [];
    return createStore({
        list,
        loading: false,
        pageSize,
        page,
    });
};

export const initActions = <TItem>(fetch: TFetch<TItem>) =>
    (store: Store<IListState<TItem>>) => ({
        changePageSize: async (_: any, pageSize: number): Promise<void> => {
            return new Promise<void>((resolve) => {
                store.setState({ loading: true });
                setTimeout(() => {
                    store.setState({ loading: false });
                    resolve();
                }, 200);
            });
        },
        fetch: async (state: IListState<TItem>, page: number) => {
            store.setState({ loading: true });
            const list: TItem[] = await fetch(page, state.pageSize);
            store.setState({
                loading: false,
                page,
                list,
            });
        },
    });
