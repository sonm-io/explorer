import * as unistore from 'unistore/react';
import { Store } from 'unistore';
import { IListState } from 'src/stores/generic/paged-list';
import createRoot from 'src/components/common/Root';
import { TCmpCtor } from 'src/types';
import { IFetchActions, IFetchCtl } from 'src/stores/generic/fetch-store';

export interface IList<TItem> extends IListState<TItem> {
    fetch: () => Promise<void>;
    update: <U extends keyof IListState<TItem>>(upd: Pick<IListState<TItem>, U>) => Promise<void>;
}

export const connect = <TItem, P extends IList<TItem>>(
    actions: (store: Store<IListState<TItem>>) => IFetchActions<IListState<TItem>>,
    Cmp: TCmpCtor<P>
) => unistore.connect((s: IListState<TItem>, a: any) => ({...s, ...a}), actions)(Cmp);

export const createListPage = <TItem, P extends IList<TItem>>(
    Cmp: TCmpCtor<P>,
    controller: IFetchCtl<IListState<TItem>>
) => {
    const ConnectedCmp = connect<TItem, IList<TItem>>(controller.actions, Cmp);
    // const fetch1stPage = () => controller.boundedActions.update && controller.boundedActions.update({ page: 1 });
    return createRoot(controller.store, ConnectedCmp);
};
