import * as React from "react";

import {Transaction as Tx} from "../../../types/Transaction";
import Paper from "@material-ui/core/Paper/Paper";
import {Link} from "react-router-dom";

interface TransactionState {
    txHash: string,
    loading: boolean
    transaction: Tx
    error?: never
}


class TransactionPage extends React.Component<any, TransactionState> {
    state = {
        txHash: this.props.match.params.txHash,
        loading: false,
        transaction: new Tx()
    } as TransactionState;

    componentDidMount() {
        fetch("http://localhost:3544/transactions?limit=15&order=nonce&hash.eq" + this.state.txHash)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText)
                }
                return response.json()
            })
            .then(result => {
                this.setState({
                    loading: true,
                    transaction: result[0]
                } as TransactionState)
            })
            .catch(err => {
                this.setState({
                    loading: true,
                    error: err
                } as TransactionState)
            })
    }

    render() {
        console.log(this.state);
        if (this.state.error != null) {
            return (
                <Paper>
                    <h1>{this.state.error}</h1>
                </Paper>
            )
        }

        return (
            <div>
                <h1>Transaction - {this.state.txHash}</h1>
                <div>
                    block number:
                    <Link to={"/block/" + this.state.transaction.blockHash}>
                        {this.state.transaction.blockNumber}
                    </Link>
                </div>
                <div>
                    block hash:
                    <Link to={"/block/" + this.state.transaction.blockHash}>
                        {this.state.transaction.blockHash}
                    </Link>
                </div>
                <div>from:
                    <Link to={"/address/" + this.state.transaction.from}>{this.state.transaction.from}</Link>
                </div>
                <div>to:
                    <Link to={"/address/" + this.state.transaction.to}>{this.state.transaction.to}</Link>
                </div>
                <div>value: {this.state.transaction.value}</div>
                <div>gas: {this.state.transaction.gas}</div>
                <div>gas price: {this.state.transaction.gasPrice}</div>
            </div>

        )
    }
}

export default TransactionPage;
