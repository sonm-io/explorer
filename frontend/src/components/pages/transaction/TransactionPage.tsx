import * as React from "react";

import Grid from "@material-ui/core/Grid/Grid";
import Paper from "@material-ui/core/Paper/Paper";
import {Link} from "react-router-dom";
import {Transaction} from "src/types/Transaction";
import Loader from "../../loader/Loader";
import { IItemProps } from "src/components/item";

interface ITransactionPageProps extends IItemProps<Transaction> {}

export class TransactionPage extends React.Component<ITransactionPageProps, never> {
    private renderMain(item: Transaction) {
        return (
            <div>
                <h1 style={{padding: 16}}>Transaction details</h1>

                <Paper style={{padding: 16}}>
                    <Grid container spacing={16}>

                        <Grid item xs={2}>Hash</Grid>
                        <Grid item xs={10}>{item.hash}</Grid>

                        <Grid item xs={2}>Block</Grid>
                        <Grid item xs={10}>
                            <Link to={"/block/" + item.blockNumber}>
                                {item.blockNumber}
                            </Link>
                        </Grid>

                        <Grid item xs={2}>From</Grid>
                        <Grid item xs={10}>
                            <Link to={"/address/" + item.from}>
                                {item.from}
                            </Link>
                        </Grid>

                        <Grid item xs={2}>To</Grid>
                        <Grid item xs={10}>
                            <Link to={"/address/" + item.to}>
                                {item.to}
                            </Link>
                        </Grid>

                        <Grid item xs={2}>Value</Grid>
                        <Grid item xs={10}>{item.value}</Grid>

                        <Grid item xs={2}>Gas</Grid>
                        <Grid item xs={10}>{item.gas}</Grid>

                        <Grid item xs={2}>Gas Price</Grid>
                        <Grid item xs={10}>{item.gasPrice}</Grid>

                    </Grid>
                </Paper>
            </div>
        );
    }

    public render() {
        const p = this.props;
        return p.pendingSet.size > 0
            ? <Loader/>
            : this.props.data !== undefined
            ? this.renderMain(this.props.data)
            : null;
    }
}
