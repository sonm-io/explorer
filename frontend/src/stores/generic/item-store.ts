import Fetch, { IFetchState, IFetchConfig, IFetchCtl } from "./fetch-store";
import Notifications from '../features/notifications';

// Interfaces

export interface IItemState<TData> extends IFetchState {
    id?: string;
    data?: TData;
}

export interface IItemFetchConfig<TData> extends IFetchConfig<
    IItemState<TData>,
    [string],
    TData | string
> {}

// Implementation

export const init = <TData>(
    fetchMethod: (id: string) => Promise<TData | string>
): IFetchCtl<IItemState<TData>> => {
    const fetchConfig: IItemFetchConfig<TData> = {
        fetchMethod,
        getArgs: (state) => ([state.id || '']),
        updateStore: (store, result) => {
            if (typeof(result) === 'string') {
                Notifications.actions(store).addSnackbar(store.getState(), result);
            } else {
                store.setState({data: result});
            }
        },
    };
    return Fetch.init(Fetch.initState(), fetchConfig);
};

export default {
    init,
};
