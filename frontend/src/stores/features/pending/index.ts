import { Store } from "unistore";

export interface IPendingState {
    pendingSet: Map<number, boolean>;
}

let pendingIdx: number = 0;

const startPending = (store: Store<IPendingState>): number => {
    const pendingId = pendingIdx++;
    const state = store.getState();
    const pendingSet = new Map(state.pendingSet);
    pendingSet.set(pendingId, true);
    store.setState({ pendingSet });
    return pendingId;
};

const stopPending = (store: Store<IPendingState>, pendingId: number): void => {
    const state = store.getState();
    const pendingSet = new Map(state.pendingSet);
    pendingSet.delete(pendingId);
    console.log(state.pendingSet);
    store.setState({ pendingSet });
};

export const pending = <T extends IPendingState>(
    store: Store<T>,
    asyncFn: (...args: any[]) => Promise<any>
) => {
    return async function(...args: any[]) {
        const pendingId = startPending(store);
        try {
            return await asyncFn.apply(this, args);
        } finally {
            stopPending(store, pendingId);
        }
    };
};

export default {
    initState: (): IPendingState => ({ pendingSet: new Map<number, boolean>() }),
};
