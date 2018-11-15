import * as React from 'react';
import { Store } from 'unistore';
import { Provider } from 'unistore/react';

interface IRootProps {
    store: Store<{}>;
    onDidMount?: () => void;
}

class Root extends React.Component<IRootProps> {

    public componentDidMount() {
        const p = this.props;
        p.onDidMount && p.onDidMount();
    }

    public render() {
        const p = this.props;
        return (
            <Provider store={p.store}>
                {this.props.children}
            </Provider>
        );
    }
}

const createRoot = (store: Store<{}>, children: any, onDidMount?: () => void) => (
    <Root
        store={store}
        onDidMount={onDidMount}
    >
        {React.createElement(children)}
    </Root>
);

export default createRoot;
