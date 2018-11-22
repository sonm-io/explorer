import * as React from 'react';
import { withSnackbar, InjectedNotistackProps } from 'notistack';
import { INotification } from 'src/stores/features/notifications'; // ToDo: is it good to import from stores?

export interface INotifierProps extends InjectedNotistackProps {
    notifications: INotification[];
    removeSnackbar: (key: string) => void;
}

interface INotificationState {
    displayed: string[]; // notifications keys array
}

export class Notifier extends React.Component<INotifierProps, INotificationState> {
    public state = {
        displayed: [] as string[],
    };

    private storeDisplayed = (key: string) => {
        this.setState(({ displayed }) => ({
            displayed: [...displayed, key],
        }));
    }

    public componentDidUpdate() {
        const { notifications, enqueueSnackbar, removeSnackbar } = this.props;
        const { displayed } = this.state;
        console.log('notifications:');
        console.log(notifications);
        (notifications || [] /* ToDo: remove it after rewrite transactions to new pagelist2 store */).forEach((notification: INotification) => {
            // If notification already displayed, abort
            if (displayed.indexOf(notification.key) > -1) { return; }
            // Display notification using notistack
            enqueueSnackbar(notification.message, notification.options);
            // Add notification's key to the local state
            this.storeDisplayed(notification.key);
            // Dispatch action to remove the notification from store
            removeSnackbar(notification.key);
        });
    }

    public render() {
        return null;
    }
}

export default withSnackbar(Notifier);
