import { Store, BoundAction } from "unistore";

// === Types and interfaces

export type TActionsFactory<TState, TActions> = (store: Store<TState>) => TActions;

type TBoundActions<TActions> = {
    [K in keyof TActions]: BoundAction;
};

export interface IController<TState, TActions, TBoundAct=TBoundActions<TActions>> {
    store: Store<TState>;
    actions: (store: Store<TState>) => TActions;
    boundedActions: TBoundAct;
}

// ToDo: Для фичи вместо getFeatureConfig удобнее иметь интерфейс с отдельными методами: initStore, initActions, getBoundedActions. Т.к. фичу может реализовывать другой store и его initStore должен вызвать initStore фичи.
export interface IFeatureConfig<
    TState,
    TActions,
    TBoundActions
> {
    initialState: TState;
    actions: (store: Store<TState>) => TActions;
    getBoundActions: (store: Store<TState>, actions: (store: Store<TState>) => TActions) => TBoundActions;
}

// === Utilities

// export const getBoundActions = <TState, TActions>(
//     store: Store<TState>,
//     actionsFactory: (store: Store<TState>) => TActions
// ): TBoundActions<TActions> => {
//     const actions = actionsFactory(store);
//     return Object.keys(actions).reduce((acc, k) => {
//         const act = store.action(actions[k]);
//         acc[k] = act;
//         return acc;
//     }, {} as TBoundActions<TActions>);
// };

// export const mergeActions = (...factories: Array<(store:Store<any>)=>any>) => {
//     return (store: Store<any>) => Object.assign({}, ...factories.map((a) => a(store)));
// };

// export const initCtl = (...features: Array<IFeatureConfig<any, any, any>>) => {
//     const states = features.map((i) => i.initialState);
//     const store = createStore(Object.assign({}, ...states));
//     const actions = mergeActions(...features.map((i) => i.actions));
//     const boundedActions = Object.assign({}, features.map((f) => f.getBoundActions(store, actions)));
//     return {
//         store,
//         actions,
//         boundedActions,
//     };
// };
