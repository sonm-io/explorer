import * as React from 'react';
import { Provider, connect } from 'unistore/react';
import { IListState } from 'src/stores/paged-list/types';
import PagedList from 'src/stores/paged-list';
import { BlocksPage } from './BlocksPage';
import { EndpointAddr } from 'src/config';
import { Block } from 'src/types/Block';

const fetchData = async (page: number, pageSize: number) => {
    const offset = pageSize * page;
    const limit = pageSize;
    const url = EndpointAddr + "/blocks?order=number.desc&limit=" + limit + "&offset=" + offset;
    console.log(url);
    return await fetch(url)
        .then((res) => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            return res.json();
        })
        .catch((error) => {
            return error.toString();
        });
};

const store = PagedList.initStore<Block>();

const actions = PagedList.initActions(fetchData);

const ConnectedCmp = connect((s: IListState<Block>, a: any) => ({...s, ...a}), actions)(BlocksPage);

const boundActions = {
    fetch: store.action(actions(store).fetch),
};
boundActions.fetch(1);

export default () => (
    <Provider store={store}>
        <ConnectedCmp />
    </Provider>
);
