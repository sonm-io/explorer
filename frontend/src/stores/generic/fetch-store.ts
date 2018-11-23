import { Store } from 'unistore';
import { IPendingState } from '../features/pending';
import Pending, { pending } from '../features/pending';
import Notifications, { INotificationsState, INotificationsActions } from '../features/notifications';

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
}

export interface IFetchBoundActs {
    fetch: () => void;
}

// Implementaion

export const initState = () => ({
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
    });

export const getBoundActs = <TState extends IFetchState>(
    store: Store<TState>,
    actions: IFetchActions<TState>
) => ({
    fetch: store.action(actions.fetch),
});

export default {
    initState,
    initActions,
    fetchData,
    getBoundActs,
};
