import * as React from "react";

import {Transaction} from "src/types/Transaction";
import {IItemProps} from "src/components/factories/item";
import { TransactionItem } from "./TransactionItem";
import ErrorForm from 'src/components/elements/errors/Error';

interface ITransactionPageProps extends IItemProps<Transaction> {
}

export class TransactionPage extends React.Component<ITransactionPageProps, never> {

    public render() {
        const p = this.props;
        return p.pendingSet.size > 0
            ? null
            : p.data === undefined
            ? <ErrorForm error="Transaction not found" />
            : <TransactionItem data={p.data}></TransactionItem>;
    }
}
