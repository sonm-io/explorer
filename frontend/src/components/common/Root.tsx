import * as React from 'react';
import { Store } from 'unistore';
import { Provider } from 'unistore/react';
import { SnackbarProvider } from 'notistack';
import notifier from 'src/components/elements/notifier/';
import notifyStore from 'src/stores/features/notifications';
import NotifierCmp, {  } from 'src/components/elements/notifier/Notifier';
import Button from '@material-ui/core/Button';
import { LoadMask } from 'src/components/elements/load-mask';

const Notifier = notifier.connect(notifyStore.actions, NotifierCmp);

const createRoot = (store: Store<{}>, Children: any, onDidMount?: () => void) => (
    class Root extends React.Component {
        public componentDidMount() {
            onDidMount && onDidMount();
        }

        public render() {
            return (
                <SnackbarProvider
                    maxSnack={8}
                    autoHideDuration={6000}
                    action={[
                        <Button color="secondary" size="small" key="action">
                            Dismiss
                        </Button>,
                    ]}
                >
                    <Provider store={store}>
                        <React.Fragment>
                            <Notifier />
                            <LoadMask>
                                <Children />
                            </LoadMask>
                        </React.Fragment>
                    </Provider>
                </SnackbarProvider>
            );
        }
    }
);

export default createRoot;
