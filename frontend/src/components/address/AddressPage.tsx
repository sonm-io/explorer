import * as React from "react";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import {Link} from "react-router-dom";
import {Transaction} from "../../types/Transaction";



interface AddressState {
    address: string
    loading: boolean
    transactions: Transaction[]
    error?: never
}

class AddressPage extends React.Component<any, AddressState> {
    state = {
        address: this.props.match.params.address,
        loading: false,
        transactions: []
    } as AddressState;

    componentDidMount() {
        fetch("http://localhost:3544/transactions?limit=15&order=nonce&to=eq." + this.state.address + "&from=eq." + this.state.address)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json()
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
                                    <TableCell numeric><Link to={"/transaction/" + row.hash}>{row.hash}</Link></TableCell>
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

export default AddressPage;
