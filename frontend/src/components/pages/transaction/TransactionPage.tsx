import * as React from "react";

import {Transaction} from "src/types/Transaction";
import {IItemProps} from "src/components/factories/item";
import { TransactionItem } from "./TransactionItem";

interface ITransactionPageProps extends IItemProps<Transaction> {
}

export class TransactionPage extends React.Component<ITransactionPageProps, never> {

    public render() {
        const p = this.props;
        return p.data !== undefined
            ? React.createElement(TransactionItem, p.data)
            : null;
    }
}
