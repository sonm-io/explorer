import { OptionsObject } from "notistack";
import { Store } from "unistore";
import { IFeatureConfig } from "../../common";

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
    removeSnackbar: (state: INotificationsState, key: string) => void;
}

export const initState = (): INotificationsState => ({
    notifications: [],
});

export const actions = (store: Store<INotificationsState>): INotificationsActions => ({
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
