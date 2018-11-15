import { connect } from 'unistore/react';
import PagedList, { TFetch } from 'src/stores/paged-list';
import { IListState } from 'src/stores/paged-list/types';
import createRoot from 'src/components/root';

type TCmpCtor<P={}, S={}> = new(props: P, context?: any) => React.Component<P, S>;

export const createListPage = <TItem>(Cmp: TCmpCtor, fetchData: TFetch<TItem>) => {
    const store = PagedList.initStore<TItem>();
    const actions = PagedList.initActions(fetchData);
    const ConnectedCmp = connect((s: IListState<TItem>, a: any) => ({...s, ...a}), actions)(Cmp);
    const boundActions = {
        fetch: store.action(actions(store).fetch),
    };

    const fetch1stPage = () => boundActions.fetch(1);

    return createRoot(store, ConnectedCmp, fetch1stPage);
};
