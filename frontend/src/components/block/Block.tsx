import * as React from "react";

import {Block as B} from "../../types/Block";
import Paper from "@material-ui/core/Paper/Paper";
import Grid from "@material-ui/core/Grid/Grid";
import {Link} from "react-router-dom";


interface BlockState {
    block: B,
    blockHash: string,
    blockNumber: number,
    loading: boolean,
    error?: never
}


export class Block extends React.Component<any, BlockState> {

    state = {
        blockHash: this.props.match.params.blockHash,
        block: new B(),
        loading: false
    } as BlockState;


    componentDidMount() {
        let url = "http://localhost:3544/blocks?hash=eq." + this.props.match.params.blockHash;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json()
            })
            .then(result => {
                console.log("loaded");
                if (result.length == 0) {
                    throw new Error("block doesn't exist")
                }
                this.setState({
                    loading: true,
                    block: result[0]
                } as BlockState);
            })
            .catch(err => {
                this.setState({
                    loading: true,
                    block: new B(),
                    error: err
                } as BlockState)
            })
    }

    render() {

        if (this.state.error != null) {
            return (
                <h1>error - {this.state.error}</h1>
            )
        }

        return (
            <Paper>
                <h1>Block #{this.state.block.number}</h1>

                <Grid container spacing={8}>
                    <Grid item xs={2}>Hash</Grid>
                    <Grid item xs={10}>{this.state.block.hash}</Grid>

                    <Grid item xs={2}>Timestamp</Grid>
                    <Grid item xs={10}>{this.state.block.timestamp}</Grid>

                    <Grid item xs={2}>Transactions</Grid>
                    <Grid item xs={10}>{this.state.block.txCount}</Grid>

                    <Grid item xs={2}>Parent Hash</Grid>
                    <Grid item xs={10}>
                        <Link replace={true} to={"/block/" + this.state.block.parentHash}>
                            {this.state.block.parentHash}
                        </Link>
                    </Grid>

                    <Grid item xs={2}>Gas Used</Grid>
                    <Grid item xs={10}>{this.state.block.gasUsed}</Grid>

                    <Grid item xs={2}>Gas Limit</Grid>
                    <Grid item xs={10}>{this.state.block.gasLimit}</Grid>

                    <Grid item xs={2}>Mined by</Grid>
                    <Grid item xs={10}>{this.state.block.miner}</Grid>

                    <Grid item xs={2}>Nonce</Grid>
                    <Grid item xs={10}>{this.state.block.nonce}</Grid>

                    <Grid item xs={2}>Size</Grid>
                    <Grid item xs={10}>{this.state.block.size}</Grid>
                </Grid>
            </Paper>
        )
    }
}
