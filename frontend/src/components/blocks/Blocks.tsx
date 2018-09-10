import * as React from "react";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";


class Block {
    number: number;
    hash: string;
    parentHash: string;
    nonce: string;
    sha3Uncles: string;
    logsBloom: string;
    transactionsRoot: string;
    stateRoot: string;
    receiptsRoot: string;
    miner: string;
    difficulty: number;
    totalDifficulty: number;
    size: number;
    extraData: string;
    gasLimit: number;
    gasUsed: number;
    timestamp: number;
    mixhash: string;
    txCount: number;
}


interface BlocksState {
    blocks: Block[];
    loading: boolean;
    error?: never;
}

export class Blocks extends React.Component<any, BlocksState> {
    state = {
        blocks: [],
        loading: false,
    } as BlocksState;

    componentDidMount() {
        fetch("http://localhost:3544/blocks?limit=15&order=number.desc")
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.statusText)
                }
                return res.json()
            })
            .then(
                (result) => {
                    console.log(result);
                    this.setState({
                        blocks: result,
                        loading: true
                    } as BlocksState)
                }
            )
            .catch(error => {
                this.setState({
                    blocks: [],
                    loading: true,
                    error: error,
                } as BlocksState)
            })
    }

    render() {
        if (this.state.error != null) {
            return (
                <Paper>
                    <h1>error!</h1>
                </Paper>
            )
        } else {
            return (
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Height</TableCell>
                                <TableCell>Age</TableCell>
                                <TableCell>Txn</TableCell>
                                <TableCell>GasUsed</TableCell>
                                <TableCell>GasLimit</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.blocks.map(row => {
                                return (
                                    <TableRow key={row.number}>
                                        <TableCell numeric>{row.number}</TableCell>
                                        <TableCell numeric>{row.timestamp}</TableCell>
                                        <TableCell numeric>{row.txCount}</TableCell>
                                        <TableCell numeric>{row.gasUsed}</TableCell>
                                        <TableCell numeric>{row.gasLimit}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            )
        }
    }
}
