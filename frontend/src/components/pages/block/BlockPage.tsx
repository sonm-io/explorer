import * as React from "react";

import Grid from "@material-ui/core/Grid/Grid";
import Paper from "@material-ui/core/Paper/Paper";
import {Link} from "react-router-dom";
import { Block } from "src/types/Block";
import Loader from "../../loader/Loader";
import { IItemProps } from "src/components/item";

interface IBlockPageProps extends IItemProps<Block> {}

export class BlockPage extends React.Component<IBlockPageProps> {
    private renderMain(item: Block) {
        return (
            <div>
                <h1 style={{padding: 16}}>Block details</h1>
                <Paper style={{padding: 16}}>
                    <Grid container spacing={16}>
                        <Grid item xs={2}>Height</Grid>
                        <Grid item xs={10}>{item.number}</Grid>
                        <Grid item xs={2}>Hash</Grid>
                        <Grid item xs={10}>{item.hash}</Grid>
                        <Grid item xs={2}>Timestamp</Grid>
                        <Grid item xs={10}>{item.timestamp}</Grid>
                        <Grid item xs={2}>Transactions</Grid>
                        <Grid item xs={10}>{item.txCount}</Grid>
                        <Grid item xs={2}>Parent Hash</Grid>
                        <Grid item xs={10}>
                            <Link to={"/block/" + String(item.number - 1)}>
                                {item.parentHash}
                            </Link>
                        </Grid>
                        <Grid item xs={2}>Gas Used</Grid>
                        <Grid item xs={10}>{item.gasUsed}</Grid>
                        <Grid item xs={2}>Gas Limit</Grid>
                        <Grid item xs={10}>{item.gasLimit}</Grid>
                        <Grid item xs={2}>Mined by</Grid>
                        <Grid item xs={10}>{item.miner}</Grid>
                        <Grid item xs={2}>Nonce</Grid>
                        <Grid item xs={10}>{item.nonce}</Grid>
                        <Grid item xs={2}>Size</Grid>
                        <Grid item xs={10}>{item.size}</Grid>
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
