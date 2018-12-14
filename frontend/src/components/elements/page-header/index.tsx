import * as React from "react";
import * as unistore from 'unistore/react';
import { Provider } from 'unistore/react';
import { PageHeader as HeaderCmp } from "./PageHeader";
import RootStore from 'src/stores/root';

const store = RootStore.navigation.store;
const actions = RootStore.navigation.actions;

const HeaderBound = unistore.connect([], actions)(HeaderCmp);

const PageHeader = () => (
    <Provider store={store}>
        <HeaderBound />
    </Provider>
);

export default PageHeader;
