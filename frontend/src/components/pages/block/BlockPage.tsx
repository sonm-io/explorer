import * as React from "react";

import Grid from "@material-ui/core/Grid/Grid";
import {Link} from "react-router-dom";
import { Block } from "src/types/Block";
import { IItemProps } from "src/components/factories/item";
import Header from "src/components/common/header";

interface IBlockPageProps extends IItemProps<Block> {}

export class BlockPage extends React.Component<IBlockPageProps> {
    private renderMain(item: Block) {
        return (
            <div>
                <Header title="Block details" />
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
            </div>
        );
    }

    public render() {
        const p = this.props;
        return p.data !== undefined
            ? this.renderMain(p.data)
            : null;
    }
}
