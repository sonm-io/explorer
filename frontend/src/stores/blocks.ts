// import * as Api from 'src/api';
// import * as Notifications from './features/notifications';
// import * as PagedList from './paged-list2';
// import { initCtl, IController } from './common';
// import { IListActions, IListState } from './paged-list2';
// import { Block } from 'src/types/Block';
// import createStore, { Store } from 'unistore';
// import { INotificationsState, INotificationsActions } from './features/notifications';

// interface IBlocksState extends IListState<Block>, INotificationsState {}
// interface IBlocksActions extends IListActions<Block>, INotificationsActions {}

// export const init = () => {
//     const paged = PagedList.getFeatureConfig<Block>(Api.blocks);
//     const notifications = Notifications.getFeatureConfig();

//     const store: Store<IBlocksState> = createStore({ ...paged.initialState, ...notifications.initialState });
//     const actions: (store: Store<IBlocksState>) => IBlocksActions = (store: Store<IBlocksState>) => {
//         const pagedActs = paged.actions(store);
//         const notifActs = notifications.actions(store);
//         return { ...pagedActs, ...notifActs };
//     };
//     const boundedActions =
// }
