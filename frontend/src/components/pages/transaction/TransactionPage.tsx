import * as React from "react";

import {Transaction as Tx} from "../../../types/Transaction";
import Paper from "@material-ui/core/Paper/Paper";
import {Link} from "react-router-dom";
import Grid from "@material-ui/core/Grid/Grid";

interface TransactionState {
    txHash: string,
    loading: boolean
    transaction: Tx
    error?: never

    page: number,
    rowsPerPage: number,
}


class TransactionPage extends React.Component<any, TransactionState> {
    constructor(props: any) {
        super(props);

        this.loadTransaction = this.loadTransaction.bind(this);
    }

    state = {
        txHash: this.props.match.params.txHash,
        loading: false,
        transaction: new Tx(),
        page: 0,
        rowsPerPage: 10,
    } as TransactionState;

    componentDidMount() {
        this.loadTransaction()
    }

    loadTransaction() {
        const url = "http://localhost:3544/transactions?order=nonce&hash.eq" + this.state.txHash;
        fetch(url)
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
        if (this.state.error != null) {
            return (
                <Paper>
                    <h1>{this.state.error}</h1>
                </Paper>
            )
        }

        if (!this.state.loading){
            return(
                <Paper>
                    <h1>Loading...</h1>
                </Paper>
            )
        }

        return (
            <div>
                <h1 style={{padding: 16}}>Transaction details</h1>

                <Paper style={{padding: 16}}>


                    <Grid container spacing={16}>

                        <Grid item xs={2}>Hash</Grid>
                        <Grid item xs={10}>{this.state.txHash}</Grid>

                        <Grid item xs={2}>Block</Grid>
                        <Grid item xs={10}>
                            <Link to={"/block/" + this.state.transaction.blockNumber}>
                                {this.state.transaction.blockNumber}
                            </Link>
                        </Grid>

                        <Grid item xs={2}>From</Grid>
                        <Grid item xs={10}>
                            <Link to={"/address/" + this.state.transaction.from}>
                                {this.state.transaction.from}
                            </Link>
                        </Grid>

                        <Grid item xs={2}>To</Grid>
                        <Grid item xs={10}>
                            <Link to={"/address/" + this.state.transaction.to}>
                                {this.state.transaction.to}
                            </Link>
                        </Grid>

                        <Grid item xs={2}>Value</Grid>
                        <Grid item xs={10}>{this.state.transaction.value}</Grid>

                        <Grid item xs={2}>Gas</Grid>
                        <Grid item xs={10}>{this.state.transaction.gas}</Grid>

                        <Grid item xs={2}>Gas Price</Grid>
                        <Grid item xs={10}>{this.state.transaction.gasPrice}</Grid>

                    </Grid>
                </Paper>
            </div>
        )
    }
}

export default TransactionPage;
