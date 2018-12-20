import createStore from 'unistore';
import { IFooterApi } from 'src/api/footer-api';

export interface IFooterState {
    isReady: boolean;
    navigation?: string;
    socials?: string;
}

export const init = (api: IFooterApi) => {
    const state: IFooterState = {
        isReady: false
    };
    const store = createStore(state);
    const promiseNav = api.getNavigation().then((text) => store.setState({ navigation: text }));
    const promiseSoc = api.getSocials().then((text) => store.setState({ socials: text }));
    Promise.all([promiseNav, promiseSoc]).then((values) => store.setState({ isReady: true }));
    return {
        store
    };
};

export default {
    init
};
