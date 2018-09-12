import * as React from "react";

import {Transaction as Tx} from "../../types/Transaction";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import {Link} from "react-router-dom";


interface TransactionState {
    transactions: Tx[],
    loading: boolean,
    error?: never
}

export class Transactions extends React.Component<any, TransactionState> {

    state = {
        transactions: [],
        loading: false,
    } as TransactionState;

    componentDidMount() {
        fetch("http://localhost:3544/transactions?limit=15&order=blockNumber")
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })

            .then(result => {
                this.setState({
                    transactions: result,
                    loading: true,
                } as TransactionState);
            })
            .catch(err => {
                this.setState({
                    loading: true,
                    error: err,
                } as TransactionState);
            })
    }

    render() {
        return (
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>TxHash</TableCell>
                            <TableCell>Block</TableCell>
                            <TableCell>From</TableCell>
                            <TableCell>To</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.transactions.map(row => {
                            return (
                                <TableRow key={row.hash}>
                                    <TableCell numeric>
                                        <Link to={"/transaction/" + row.hash}>{row.hash}</Link>
                                    </TableCell>
                                    <TableCell numeric>
                                        <Link to={"/block/" + row.blockHash}>{row.blockNumber}</Link>
                                    </TableCell>
                                    <TableCell numeric>
                                        <Link to={"/address/" + row.from}>{row.from}</Link>
                                    </TableCell>
                                    <TableCell numeric>
                                        <Link to={"/address/" + row.to}>{row.to}</Link>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Paper>
        )
    }
}
