import * as unistore from 'unistore/react';
import { Store } from 'unistore';
import createRoot from 'src/components/generic/content-root';
import { TCmpCtor } from 'src/types';
import { IItemState } from 'src/stores/generic/item-store';
import { IFetchActions, IFetchCtl } from 'src/stores/generic/fetch-store';

export interface IItemProps<TData> extends IItemState<TData> {
    fetch: (id: string) => Promise<void>;
}

export const connect = <TData, P extends IItemState<TData>>(
    actions: (store: Store<IItemState<TData>>) => IFetchActions<IItemState<TData>>,
    Cmp: TCmpCtor<P>
) => unistore.connect((s: IItemState<TData>, a: any) => ({...s, ...a}), actions)(Cmp);

export const createItemPage = <TData, P extends IItemProps<TData>>(
    Cmp: TCmpCtor<P>,
    controller: IFetchCtl<IItemState<TData>>
) => {
    const ConnectedCmp = connect<TData, IItemProps<TData>>(controller.actions, Cmp);
    return createRoot(controller.store, ConnectedCmp);
};
