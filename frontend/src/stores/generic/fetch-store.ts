import createStore, { Store } from 'unistore';
import { IPendingState } from '../features/pending';
import Pending, { pending } from '../features/pending';
import Notifications, { INotificationsState, INotificationsActions } from '../features/notifications';
import { IController } from '../common';
import { History } from 'history';

export interface IFetchState extends IPendingState, INotificationsState {}

export interface IFetchConfig<
    TState extends IFetchState,
    TFetchArgs extends any[],
    TFetchResult
> {
    fetchMethod: (...args: TFetchArgs) => Promise<TFetchResult>;
    getArgs: (state: TState) => TFetchArgs;
    updateStore: (store: Store<TState>, result: TFetchResult) => void;
    getRoute?: (state: TState) => string;
}

export interface IFetchActions<TState extends IFetchState> extends INotificationsActions {
    fetch: (state: TState) => Promise<void>;
    update: <U extends keyof TState>(state: TState, upd: Pick<TState, U>) => Promise<void>;
    updateRoute: <U extends keyof TState>(state: TState, upd: Pick<TState, U>) => void;
}

// This should reflect IFetchActions.
// Implement this interface in Props of Component. Then connect store's actions to this component.
export interface IFetchCmpActions<TProps> {
    fetch: () => Promise<void>;
    update: <U extends keyof TProps>(upd: Pick<TProps, U>) => Promise<void>;
    updateRoute: <U extends keyof TProps>(upd: Pick<TProps, U>) => void;
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

export const initActions = <S extends IFetchState, A extends any[], R>(
    config: IFetchConfig<S,A,R>,
    history?: History
) =>
    (store: Store<S>): IFetchActions<S> => ({
        ...Notifications.actions(store),
        fetch: fetchData(config)(store),
        update: async (_: S, upd: Pick<S, keyof S>) => {
            //debugger;
            console.log('update:');
            console.log(upd);
            store.setState(upd);
            fetchData(config)(store)(store.getState());
        },
        updateRoute: async (_: S, upd: Pick<S, keyof S>) => {
            if (config.getRoute === undefined) {
                throw new Error("getRoute must be specified when updateRoute is used");
            }
            if (history === undefined) {
                throw new Error("history must be passed when updateRoute is used");
            }
            store.setState(upd);
            history.push(config.getRoute(store.getState()));
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
    config: IFetchConfig<TState, TFetchArgs, TFetchResult>,
    history?: History
): IFetchCtl<TState> => {
    const store = createStore({...initialState as object} as TState);
    const actions = initActions(config, history);
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
