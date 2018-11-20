import { Store, BoundAction } from "unistore";

type TBoundActions<TActions> = {
    [K in keyof TActions]: BoundAction;
};

export interface IController<TState, TActions, TBoundAct=TBoundActions<TActions>> {
    store: Store<TState>;
    actions: (store: Store<TState>) => TActions;
    boundedActions: TBoundAct;
}

export const getBoundActions = <TState, TActions>(
    store: Store<TState>,
    actionsFactory: (store: Store<TState>) => TActions
): TBoundActions<TActions> => {
    const actions = actionsFactory(store);
    return Object.keys(actions).reduce((acc, k) => {
        const act = store.action(actions[k]);
        acc[k] = act;
        return acc;
    }, {} as TBoundActions<TActions>);
};
