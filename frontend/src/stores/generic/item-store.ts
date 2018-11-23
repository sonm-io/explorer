import Fetch, { IFetchState, IFetchConfig } from "./fetch-store";
import Notifications, { INotificationsActions } from "../features/notifications";
import createStore, { Store } from "unistore";
import { IController, TActionsFactory } from "../common";

// Interfaces

export interface IItemState<TData> extends IFetchState {
    id?: string;
    data?: TData;
}

export interface IItemActions<TData> extends INotificationsActions {
    fetch: (state: IItemState<TData>, id: string) => Promise<void>;
}

export interface IItemBoundActs {
    fetch: (id: string) => void;
}

export interface IItemFetchConfig<TData> extends IFetchConfig<
    IItemState<TData>,
    [string],
    TData | string
> {}

export interface IItemCtl<TData> extends IController<
    IItemState<TData>,
    IItemActions<TData>,
    IItemBoundActs
> {}

// Implementation

export const initActions = <TData>(config: IItemFetchConfig<TData>) =>
    (store: Store<IItemState<TData>>): IItemActions<TData> => ({
        ...Notifications.actions(store),
        fetch: async (state, id) => {
            store.setState({id});
            Fetch.fetchData(config)(store)(state);
        },
    });

const getBoundActions = <TData>(
    store: Store<IItemState<TData>>,
    actions: TActionsFactory<IItemState<TData>, IItemActions<TData>>
): IItemBoundActs => ({
    fetch: store.action(actions(store).fetch),
});

export const init = <TData>(
    fetchMethod: (id: string) => Promise<TData | string>
): IItemCtl<TData> => {
    const state: IItemState<TData> = {
        ...Fetch.initState(),
    };
    const store = createStore(state);
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
    const actions = initActions(fetchConfig);
    return {
        store,
        actions,
        boundedActions: getBoundActions(store, actions),
    };
};

export default {
    init,
};
