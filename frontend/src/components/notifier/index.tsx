import * as unistore from 'unistore/react';
import { INotificationsState, INotificationsActions } from 'src/stores/features/notifications';
import { Store } from 'unistore';
import { ComponentConstructor } from 'unistore/react';

// ToDo: Do I need it?
const connect = (
    actions: (store: Store<INotificationsState>) => INotificationsActions,
    Cmp: ComponentConstructor
) => unistore.connect((s: INotificationsState, a: any) => ({...s, ...a}), actions)(Cmp);

export default { connect };
