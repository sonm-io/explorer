import * as React from "react";
import * as unistore from 'unistore/react';
import { Provider } from 'unistore/react';
import { Header as HeaderCmp } from "./Header";
import RootStore from 'src/stores/root';

const store = RootStore.navigation.store;
const actions = RootStore.navigation.actions;

const HeaderBound = unistore.connect([], actions)(HeaderCmp);

const Header = () => (
    <Provider store={store}>
        <HeaderBound />
    </Provider>
);

export default Header;
