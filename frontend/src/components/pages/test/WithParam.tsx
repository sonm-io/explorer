import * as React from "react";

interface IParams {
    name: string;
    age: number;
}

export class WithParams extends React.Component<IParams> {
    public render() {
        const p = this.props;
        return (
            <div>{p.name} +++ {p.age}</div>
        );
    }
}
