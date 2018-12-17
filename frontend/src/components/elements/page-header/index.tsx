import * as React from "react";
import * as unistore from 'unistore/react';
import { Provider } from 'unistore/react';
import { PageHeader as HeaderCmp } from "./PageHeader";
import RootStore from 'src/stores/root';
import { INavigationState } from "src/stores/navigation-store";

const store = RootStore.navigation.store;
const actions = RootStore.navigation.actions;

const HeaderBound = unistore.connect((s: INavigationState, a: any) => ({...s, ...a}), actions)(HeaderCmp);

const PageHeader = () => (
    <Provider store={store}>
        <HeaderBound />
    </Provider>
);

export default PageHeader;
