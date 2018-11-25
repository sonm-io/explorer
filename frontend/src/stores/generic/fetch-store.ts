import createStore, { Store } from 'unistore';
import { IPendingState } from '../features/pending';
import Pending, { pending } from '../features/pending';
import Notifications, { INotificationsState, INotificationsActions } from '../features/notifications';
import { IController } from '../common';

export interface IFetchState extends IPendingState, INotificationsState {}

export interface IFetchConfig<
    TState extends IFetchState,
    TFetchArgs extends any[],
    TFetchResult
> {
    fetchMethod: (...args: TFetchArgs) => Promise<TFetchResult>;
    getArgs: (state: TState) => TFetchArgs;
    updateStore: (store: Store<TState>, result: TFetchResult) => void;
}

export interface IFetchActions<TState extends IFetchState> extends INotificationsActions {
    fetch: (state: TState) => Promise<void>;
    update: <U extends keyof TState>(state: TState, upd: Pick<TState, U>) => Promise<void>;
}

export interface IFetchBoundActs<TState> {
    fetch: () => void;
    update: <U extends keyof TState>(upd: Pick<TState, U>) => void;
}

export interface IFetchCtl<TState extends IFetchState> extends
    IController<TState, IFetchActions<TState>, IFetchBoundActs<TState>> {}

// Implementaion

export const initState = (): IFetchState => ({
    ...Pending.initState(),
    ...Notifications.initState(),
});

export const fetchData = <S extends IFetchState, A extends any[], R>(config: IFetchConfig<S,A,R>) =>
    (store: Store<S>) => {
        const fn = async (state: S) => {
            const fetchArgs = config.getArgs(state);
            const result = await config.fetchMethod(...fetchArgs);
            config.updateStore(store, result);
            //ToDo: add here error handling
        };
        return pending(store, fn);
    };

export const initActions = <S extends IFetchState, A extends any[], R>(config: IFetchConfig<S,A,R>) =>
    (store: Store<S>): IFetchActions<S> => ({
        ...Notifications.actions(store),
        fetch: fetchData(config)(store),
        update: async (state: S, upd: Pick<S, keyof S>) => {
            store.setState(upd);
            fetchData(config)(store)(state);
        },
    });

export const getBoundActs = <TState extends IFetchState>(
    store: Store<TState>,
    actions: IFetchActions<TState>
) => ({
    fetch: store.action(actions.fetch),
    update: store.action(actions.update),
});

export const init = <TState extends IFetchState, TFetchArgs extends any[], TFetchResult>(
    initialState: TState,
    config: IFetchConfig<TState, TFetchArgs, TFetchResult>
): IFetchCtl<TState> => {
    const store = createStore({...initialState as object} as TState);
    const actions = initActions(config);
    return {
        store,
        actions,
        boundedActions: getBoundActs(store, actions(store)),
    };
};

export default {
    initState,
    initActions,
    init,
    fetchData,
    getBoundActs,
};
