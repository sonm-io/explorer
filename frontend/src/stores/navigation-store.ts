import { History } from 'history';
import createStore from 'unistore';

export type TNavigationMenus = 'home' | 'transactions' | 'blocks' | 'contracts';

export interface INavigationState {
    activeMenu?: TNavigationMenus;
}

export interface INavigationActions {
    onNavigate: (state: INavigationState, path: string) => void;
    onSearch: (state: INavigationState, value: string) => void;
}

export interface INavigationCmpActions {
    onNavigate: (path: string) => void;
    onSearch: (value: string) => void;
}

class Navigator implements INavigationActions {
    private history: History;
    constructor(history: History) {
        this.history = history;
    }

    private navigateTo = (path: string) => this.history.push(path);

    public onNavigate = (state: INavigationState, path: string) => {
        this.navigateTo(path);
    }

    public onSearch = (state: INavigationState, value: string) => {
        const v = value.trim();

        if (v === '') {
            return;
        }

        try {
            parseInt(v);
            this.navigateTo("/block/" + v);
        } catch (e) {
            console.log("its not block number");
        }

        if (v.length === 66) {
            this.navigateTo("/transaction/" + v);
        } else if (v.length === 42) {
            this.navigateTo("/address/" + v);
        } else {
            // TODO: redirect to not found
        }
    }
}

const initActions = (history: History) => new Navigator(history);

const init = (history: History) => {
    const state: INavigationState = {
        activeMenu: 'home'
    };
    return {
        history,
        store: createStore(state),
        actions: initActions(history),
    };
};

export default {
    init,
};
