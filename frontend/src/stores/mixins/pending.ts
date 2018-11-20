import { Ctor } from "src/types";

interface IPending {
    pendingSet: Map<string, boolean>;
    startPending: (name: string) => string;
    stopPending: (name: string) => void;
}

export const Pending = <TBase extends Ctor>(Base: TBase) => {
    return class PendingClass extends Base implements IPending {
        private pendingIdx = 0;
        public pendingSet = new Map<string, boolean>();

        public startPending = (name: string): string => {
            const pendingId = `${name}_${this.pendingIdx++}`;
            this.pendingSet.set(pendingId, true);
            return pendingId;
        }

        public stopPending = (pendingId: string): void => {
            this.pendingSet.delete(pendingId);
        }
    };
};

export const pending = (
    target: IPending,
    propertyKey: string,
    descriptor: PropertyDescriptor
) => {
    const method = descriptor.value;

    descriptor.value = async function(...args: any[]) {
        const me = this as IPending;
        const pendingId = me.startPending(propertyKey);

        try {
            return await method.apply(me, args);
        } finally {
            me.stopPending(pendingId);
        }
    };
};
