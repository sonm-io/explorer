import { History } from 'history';
import createStore from 'unistore';

class Navigator {
    private history: History;
    constructor(history: History) {
        this.history = history;
    }

    private navigateTo = (path: string) => this.history.push(path);

    public onNavigate = (state: {}, path: string) => {
        this.navigateTo(path);
    }

    public onSearch = (state: {}, value: string) => {
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

const init = (history: History) => ({
    history,
    store: createStore({}),
    actions: initActions(history),
});

export default {
    init,
};
