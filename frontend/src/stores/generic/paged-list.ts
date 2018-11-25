import { Store } from 'unistore';
import Fetch, { IFetchState, IFetchConfig, IFetchCtl } from './fetch-store';
import Notifications from '../features/notifications';

// Interfaces

export interface IListState<TItem> extends IFetchState {
    list: TItem[];
    pageSize: number;
    page: number;
}

export interface IListFetchConfig<
    TItem,
    TFetchArgs extends any[],
    TFetchResult
> extends IFetchConfig<IListState<TItem>, TFetchArgs, TFetchResult> {}

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

export const init = <TItem, TArgs extends any[], TRes>(
    fetchConfig: IListFetchConfig<TItem,TArgs,TRes>,
    pageSize?: number
): IFetchCtl<IListState<TItem>> => Fetch.init(initState(pageSize), fetchConfig);

export const initSimple = <TItem>(fetchMethod: (page: number, pageSize: number) => Promise<TItem[] | string>) =>
    init<TItem, [number, number], TItem[]|string>({
        fetchMethod,
        getArgs: getListArgs,
        updateStore: updateListStore,
    });

export default {
    initState,
    init,
    initSimple,
    getListArgs,
    updateListStore,
};
