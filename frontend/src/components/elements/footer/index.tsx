import * as React from "react";
import FooterCmp from './Footer';
import * as unistore from 'unistore/react';
import { Provider } from 'unistore/react';
import { IFooterState } from 'src/stores/footer-store';
import RootStore from 'src/stores/root';

const FooterBound = unistore.connect((s: IFooterState, a: any) => ({ ...s, ...a }))(FooterCmp);
const store = RootStore.footer.store;

const Footer = () => (
    <Provider store={store}>
        <FooterBound />
    </Provider>
);

export default Footer;
