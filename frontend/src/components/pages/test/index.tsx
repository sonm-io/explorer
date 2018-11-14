import * as React from 'react';
import { Provider, connect } from 'unistore/react';
import { IListState } from 'src/stores/paged-list/types';
import PagedList from 'src/stores/paged-list';
import { ITestItem, Test } from './TestPage';

const list: ITestItem[] = Array.from(Array(55)).map((_, i) => ({
    name: (i + 1).toString(),
    count: i+1,
}));

const getPage = <TItem extends any>(all: TItem[], page: number, pageSize: number) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    return all.slice(from, to);
};

const fetch = async (page: number, pageSize: number) => {
    return new Promise<ITestItem[]>((resolve) => {
        setTimeout(() => {
            resolve(getPage(list, page, pageSize));
        }, 2000);
    });
};

const store = PagedList.initStore<ITestItem>();

const actions = PagedList.initActions(fetch);

const TestPage = connect((s: IListState<ITestItem>, a: any) => ({...s, ...a}), actions)(Test);

const boundActions = {
    fetch: store.action(actions(store).fetch),
};

setTimeout(() => {
    boundActions.fetch(2);
}, 2000);

export default () => (
    <Provider store={store}>
        <TestPage />
    </Provider>
);
