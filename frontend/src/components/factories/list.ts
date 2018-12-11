import * as unistore from 'unistore/react';
import { Store } from 'unistore';
import { IListState } from 'src/stores/generic/paged-list';
import createRoot from 'src/components/generic/Root';
import { TCmpCtor } from 'src/types';
import { IFetchActions, IFetchCtl, IFetchCmpActions } from 'src/stores/generic/fetch-store';

export interface IListProps<TItem, TProps = never> extends IFetchCmpActions<IListState<TItem> & TProps>, IListState<TItem> {}

export const connect = <TItem, TState extends IListState<TItem>, P extends IListProps<TItem, TState>>(
    actions: (store: Store<TState>) => IFetchActions<IListState<TItem>>,
    Cmp: TCmpCtor<P>
) => unistore.connect((s: TState, a: any) => ({...s as any, ...a}), actions)(Cmp);

export const createListPage = <TItem, TState extends IListState<TItem>, P extends IListProps<TItem, TState>>(
    Cmp: TCmpCtor<P>,
    controller: IFetchCtl<TState>
) => {
    const ConnectedCmp = connect(controller.actions, Cmp);
    // const fetch1stPage = () => controller.boundedActions.update && controller.boundedActions.update({ page: 1 });
    return createRoot(controller.store, ConnectedCmp);
};
