import * as React from 'react';
import { Store } from 'unistore';
import { Provider } from 'unistore/react';

const createRoot = (store: Store<{}>, Children: any, onDidMount?: () => void) => (
    class Root extends React.Component {
        public componentDidMount() {
            console.log('root: componentDidMount');
            onDidMount && onDidMount();
        }

        public render() {
            return (
                <Provider store={store}>
                    <Children />
                </Provider>
            );
        }
    }
);

// (
//     <Root
//         store={store}
//         onDidMount={onDidMount}
//     >
//         {React.createElement(children)}
//     </Root>
// );

export default createRoot;
