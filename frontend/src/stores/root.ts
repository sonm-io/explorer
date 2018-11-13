import createStore, { Store } from 'unistore';
//import { Provider, connect } from 'unistore/react';

import { Block } from '../types/Block';

const ENDPOINT = "https://explorer.test.sonm.com/api";

export interface IListStore<TItem> {
    rowsPerPage: number;
    page: number;
    loading: boolean;
    list: TItem[];
    error?: string;
}

export interface IListActions<TItem> {
    fetch: (state: IListStore<TItem>, page?: number) => Promise<Partial<IListStore<TItem>>>;

}

type TListActionsFactory<TItem> = (store: Store<IListStore<TItem>>) => IListActions<TItem>;

export const blocksStore: Store<IListStore<Block>> = createStore({
    rowsPerPage: 10,
    page: 1,
    list: [],
    loading: false,
});

export const blocksActions: TListActionsFactory<Block> = (store) => ({
    fetch: async ({ page, rowsPerPage }) => {
        const offset = rowsPerPage * page;
        const limit = rowsPerPage;
        const url = ENDPOINT + "/blocks?order=number.desc&limit=" + limit + "&offset=" + offset;
        console.log(url);
        store.setState({ loading: true });
        return await fetch(url)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(res.statusText);
                }
                return res.json();
            })
            .then((list: Block[]) => {
                store.setState({ loading: false });
                return { list };
            })
            .catch((error) => {
                store.setState({ loading: false });
                return {
                    page: 1,
                    list: [],
                    error: error.toString(),
                };
            });
    },
});
