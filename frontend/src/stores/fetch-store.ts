import { Store } from 'unistore';

export interface IFetchState {
    isPending: boolean;
}

// tslint:disable-next-line:max-classes-per-file
export class FetchActions<
    TState extends IFetchState,
    TFetchArgs extends [],
    TFetchResult
> {
    constructor(
        store: Store<TState>,
        fetchMethod: (...args: TFetchArgs) => Promise<TFetchResult>,
        getArgs: (state: TState) => TFetchArgs,
        updateStore: (store: Store<TState>, result: TFetchResult) => void
    ) {
        this.store = store;
        this.fetchMethod = fetchMethod;
        this.getArgs = getArgs;
        this.updateStore = updateStore;
    }

    protected store: Store<TState>;
    protected fetchMethod: (...args: TFetchArgs) => Promise<TFetchResult>;
    protected getArgs: (state: TState) => TFetchArgs;
    protected updateStore: (store: Store<TState>, result: TFetchResult) => void;

    public fetch = async (state: TState) => {
        this.store.setState({ isPending: true });
        const fetchArgs = this.getArgs(state);
        const result = await this.fetchMethod(...fetchArgs);
        this.store.setState({ isPending: false });
        this.updateStore(this.store, result);
    }
}

export const initActions = async <
        TState extends IFetchState,
        TFetchArgs extends [],
        TFetchResult
    >(
        fetchMethod: (...args: TFetchArgs) => Promise<TFetchResult>,
        getArgs: (state: TState) => TFetchArgs,
        updateStore: (store: Store<TState>, result: TFetchResult) => void
    ) => (store: Store<TState>) => new FetchActions(store, fetchMethod, getArgs, updateStore);

export interface IFetchBoundActs {
    fetch: () => void;
}
