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
        this.setState({
            blockHash: this.props.match.params.blockHash
        } as BlockState);
        let url = "http://localhost:3544/blocks?hash=eq." + this.state.blockHash;
        console.log(url);
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json()
            })
            .then(result => {
                if (result.length == 0){
                    throw new Error("block doesn't exist")
                }
                this.setState({
                    loading: true,
                    block: result[0]
                } as BlockState)
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

        if (this.state.error != null){
            console.log(this.state.error)
        }

        return (
            <Paper>
                <h1>Block</h1>

                <Grid container spacing={24}>
                    <Grid item xs>
                        <Grid item xs={4}>Hash</Grid>
                        <Grid item xs={6}>{this.state.block.hash}</Grid>
                    </Grid>

                    <Grid item xs>
                        <Grid item xs={4}>Timestamp</Grid>
                        <Grid item xs={6}>{this.state.block.timestamp}</Grid>
                    </Grid>

                    <Grid item xs>
                        <Grid item xs={4}>Transactions</Grid>
                        <Grid item xs={6}>{this.state.block.txCount}</Grid>
                    </Grid>

                    <Grid item xs>
                        <Grid item xs={4}>Parent Hash</Grid>
                        <Grid item xs={6}>
                            <Link to={"/block/"+this.state.block.parentHash}>{this.state.block.parentHash}</Link>
                        </Grid>
                    </Grid>

                    <Grid item xs>
                        <Grid item xs={4}>Gas Used</Grid>
                        <Grid item xs={6}>{this.state.block.gasUsed}</Grid>
                    </Grid>

                    <Grid item xs>
                        <Grid item xs={4}>Gas Limit</Grid>
                        <Grid item xs={6}>{this.state.block.gasLimit}</Grid>
                    </Grid>

                    <Grid item xs>
                        <Grid item xs={4}>Mined by</Grid>
                        <Grid item xs={6}>{this.state.block.miner}</Grid>
                    </Grid>

                    <Grid item xs>
                        <Grid item xs={4}>Nonce</Grid>
                        <Grid item xs={6}>{this.state.block.nonce}</Grid>
                    </Grid>

                    <Grid item xs>
                        <Grid item xs={4}>Size</Grid>
                        <Grid item xs={6}>{this.state.block.size}</Grid>
                    </Grid>
                </Grid>
            </Paper>
        )
    }
}
