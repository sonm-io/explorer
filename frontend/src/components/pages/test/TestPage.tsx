import * as React from "react";
import { IList } from './list-types';

export interface ITestItem {
    name: string;
    count: number;
}

export interface ITestProps extends IList<ITestItem> {}

export class Test extends React.Component<ITestProps, never> {

    private renderItem(item: ITestItem) {
        return (
            <div>{item.name}, {item.count}</div>
        );
    }

    private handlePrev = () => {
        const p = this.props;
        p.fetch(p.page-1);
    }

    private handleNext = () => {
        const p = this.props;
        p.fetch(p.page+1);
    }

    public render() {
        const p = this.props;

        return (
            <div>
                {p.list.map((i) => this.renderItem(i))}
                <button onClick={this.handlePrev}>Prev</button>
                <button onClick={this.handleNext}>Next</button>
                {p.page}
                {p.loading ? <span>loading</span> : null}
            </div>
        );
    }
}
