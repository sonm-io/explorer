import * as React from "react";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";

class Transaction {
    hash: string;
    nonce: number;
    blockHash: string;
    blockNumber: number;
    transactionIndex: number;
    from: string;
    to: string;
    value: number;
    gas: number;
    gasPrice: number;
    input: string;
    v: string;
    r: string;
    s: string;
}

interface AddressState {
    address: string
    loading: boolean
    transactions: Transaction[]
    error?: never
}

export class Address extends React.Component<any, AddressState> {
    state = {
        address: this.props.match.params.address,
        loading: false,
        transactions: []
    } as AddressState;

    componentDidMount() {
        fetch("http://localhost:3544/transactions?limit=15&order=nonce&from=eq." + this.state.address)
            .then(responce => {
                if (!responce.ok) {
                    throw new Error(responce.statusText);
                }
                return responce.json()
            })
            .then(result => {
                this.setState({
                    transactions: result,
                    loading: true
                } as AddressState)
            })
            .catch(err => {
                this.setState({
                    loading: true,
                    error: err
                } as AddressState)
            })
    }

    render() {
        console.log(this.state);
        return (
            <Paper>
                <h1>Address - {this.state.address}</h1>
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
                        {this.state.transactions.map(row => {
                            return (
                                <TableRow key={row.hash}>
                                    <TableCell numeric>{row.hash}</TableCell>
                                    <TableCell numeric>{row.blockNumber}</TableCell>
                                    <TableCell numeric>{row.from}</TableCell>
                                    <TableCell numeric>{row.from == this.state.address ? "out" : "in"}</TableCell>
                                    <TableCell numeric>{row.to}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Paper>
        )
    }
}
