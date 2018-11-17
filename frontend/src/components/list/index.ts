import * as unistore from 'unistore/react';
import { Store } from 'unistore';
import { PagedListActions, IPagedListCtl } from 'src/stores/paged-list';
import { IListState, IListActions } from 'src/stores/paged-list';
import createRoot from 'src/components/root';
import { TCmpCtor } from 'src/types';

export interface IList<TItem> extends IListState<TItem>, IListActions {}

export const connect = <TItem, P extends IList<TItem>>(
        actions: (store: Store<IListState<TItem>>) => PagedListActions<TItem, IListState<TItem>>,
        Cmp: TCmpCtor<P>
    ) => unistore.connect((s: IListState<TItem>, a: any) => ({...s, ...a}), actions)(Cmp);

export const createListPage = <TItem, P extends IList<TItem>>(
    Cmp: TCmpCtor<P>,
    controller: IPagedListCtl<TItem>
) => {
    const ConnectedCmp = connect<TItem, IList<TItem>>(controller.actions, Cmp);
    const fetch1stPage = () => controller.boundedActions.fetch && controller.boundedActions.fetch(1);
    return createRoot(controller.store, ConnectedCmp, fetch1stPage);
};
