import { OptionsObject } from "notistack";
import { Store } from "unistore";
import { IFeatureConfig } from "../../common";

let notificationIdx = 0;

const getNewIdx = () => `notif_${++notificationIdx}`;

export interface INotification {
    key: string;
    message: string;
    options?: OptionsObject;
}

export interface INotificationsState {
    notifications: INotification[];
}

export interface INotificationsCmpActions {
    removeSnackbar: (key: string) => void;
}

export interface INotificationsActions {
    addSnackbar: (state: INotificationsState, message: string, options?: OptionsObject) => void;
    removeSnackbar: (state: INotificationsState, key: string) => void;
}

export const initState = (): INotificationsState => ({
    notifications: [],
});

export const actions = (store: Store<INotificationsState>): INotificationsActions => ({
    addSnackbar: (state: INotificationsState, message: string, options?: OptionsObject) => {
        const notifications = state.notifications;
        notifications.push({ key: getNewIdx(), message, options });
        store.setState({ notifications });
    },
    removeSnackbar: (state: INotificationsState, key: string) => {
        const notifications = state.notifications.filter((n: INotification) => n.key !== key);
        store.setState({ notifications });
    },
});

export const getFeatureConfig = (): IFeatureConfig<
    INotificationsState,
    INotificationsActions,
    {}
> => ({
    initialState: initState(),
    actions,
    getBoundActions: () => ({}),
});

export default {
    initState,
    actions,
};
