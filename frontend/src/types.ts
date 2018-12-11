export type Ctor<T={}> = new (...args: any[]) => T;
export type TCmpCtor<P={}, S={}> = new(props: P, context?: any) => React.Component<P, S>;
export type TJsPropTypes<T> = { [K in keyof T]: any };
