import * as React from "react";

import Grid from "@material-ui/core/Grid/Grid";
import Paper from "@material-ui/core/Paper/Paper";
import {Link, withRouter} from "react-router-dom";
import {EndpointAddr} from "src/config";
import {Block as B} from "../../../types/Block";
import ErrorForm from "../../errors/Error";
import Loader from "../../loader/Loader";

interface BlockState {
    blockNumber?: number;
    block?: B;
    loading: boolean;
    error?: string;
}

class BlockPage extends React.Component<any, BlockState> {

    public state: BlockState = {
        loading: true,
    };

    public componentDidMount() {
        this.loadBLock(this.props.match.params.blockHash);
    }

    public shouldComponentUpdate(nextProps: any, nextState: BlockState) {
        return this.state.blockNumber !== nextState.blockNumber;
    }

    public componentWillReceiveProps(nextProps: any) {
        if (this.props.match.params.blockHash !== nextProps.match.params.blockHash) {
            this.setState({ loading: true });
            this.loadBLock(nextProps.match.params.blockHash);
        }
    }

    public loadBLock(number: string) {
        const url = EndpointAddr + "/blocks?number=eq." + number;
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then((result) => {
                if (result.length === 0) {
                    console.log('block doesnt exist');
                    throw new Error('block doesnt exist');
                }
                this.setState({
                    loading: false,
                    block: result[0],
                    blockNumber: result[0].number,
                });
            })
            .catch((err) => {
                this.setState({
                    loading: false,
                    error: err,
                });
            });
    }

    public render() {
        if (this.state.error !== undefined) {
            return (
                <ErrorForm error={this.state.error}/>
            );
        }
        if (this.state.block == null) {
            return (
                <ErrorForm error={"Block not found"}/>
            );
        }

        if (this.state.loading) {
            return (
                <Loader/>
            );
        }

        return (
            <div>
                <h1 style={{padding: 16}}>Block details</h1>

                <Paper style={{padding: 16}}>

                    <Grid container spacing={16}>

                        <Grid item xs={2}>Height</Grid>
                        <Grid item xs={10}>{this.state.block.number}</Grid>
                        <Grid item xs={2}>Hash</Grid>
                        <Grid item xs={10}>{this.state.block.hash}</Grid>
                        <Grid item xs={2}>Timestamp</Grid>
                        <Grid item xs={10}>{this.state.block.timestamp}</Grid>
                        <Grid item xs={2}>Transactions</Grid>
                        <Grid item xs={10}>{this.state.block.txCount}</Grid>
                        <Grid item xs={2}>Parent Hash</Grid>
                        <Grid item xs={10}>
                            <Link to={"/block/" + String(this.state.block.number - 1)}>
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
            </div>
        );
    }
}

export default withRouter(BlockPage);
