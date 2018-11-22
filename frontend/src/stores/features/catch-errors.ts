import { Ctor } from "src/types";

interface IApiError {
    message: string;
    scope: object;
    // tslint:disable-next-line:ban-types
    method: Function;
    args: any[];
}

type TErrorProessor = (err: IApiError) => void;

export const HandleErrors = <TBase extends Ctor>(Base: TBase) => {
    return class HandleErrorsClass extends Base {

        private errorProcessors: TErrorProessor[] = [];

        protected registerErrorProcessor = (errProc: TErrorProessor) => {
            this.errorProcessors.push(errProc);
        }

        protected unregisterErrorProcessor = (errProc: TErrorProessor) => {
            this.errorProcessors = this.errorProcessors.filter(
                (item: TErrorProessor) => item !== errProc
            );
        }

        private handleError(err: IApiError) {
            this.errorProcessors.forEach((i) => i(err));
        }

        public static catchErrors = ({ restart = false }) => (
            target: HandleErrorsClass,
            propertyKey: string,
            descriptor: PropertyDescriptor
        ) => {
            const method = descriptor.value;

            descriptor.value = async function(...args: any[]) {
                const store = this as HandleErrorsClass;

                try {
                    return await method.apply(store, args);
                } catch (err) {
                    if (typeof err !== 'string') {
                        console.log('Unexpected exception', err);
                    }
                    store.handleError({
                        message: err,
                        scope: store,
                        method: descriptor.value,
                        args,
                    });
                }
            };
        }
    };
};
