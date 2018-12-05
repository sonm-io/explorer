import * as React from "react";
import * as unistore from 'unistore/react';
import { Provider } from 'unistore/react';
import { HomePage as HomePageCmp } from "./HomePage";
import RootStore from 'src/stores/root';

const store = RootStore.navigation.store;
const actions = RootStore.navigation.actions;

const HomePageBound = unistore.connect([], actions)(HomePageCmp);

const HomePage = () => (
    <Provider store={store}>
        <HomePageBound />
    </Provider>
);

export default HomePage;
