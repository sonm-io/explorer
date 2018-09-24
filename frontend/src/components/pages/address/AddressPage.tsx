import * as React from "react";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import {Link} from "react-router-dom";
import {Transaction} from "../../../types/Transaction";
import Grid from "@material-ui/core/Grid/Grid";


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
        const url = "http://localhost:3544/transactions?select=*&limit=15&or=(from.eq." + this.state.address + ",to.eq." + this.state.address + ")&order=nonce.desc"
        console.log(url);
        fetch(url)
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
            <Grid>
                <h1 style={{padding: 16}}>Address - {this.state.address}</h1>

                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Hash</TableCell>
                                <TableCell>Block</TableCell>
                                <TableCell>Txn</TableCell>
                                <TableCell>From</TableCell>
                                <TableCell>To</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.transactions.map(row => {
                                return (
                                    <TableRow key={row.hash}>
                                        <TableCell><Link
                                            to={"/transaction/" + row.hash}>{row.hash}</Link></TableCell>
                                        <TableCell>{row.blockNumber}</TableCell>
                                        <TableCell>{row.from}</TableCell>
                                        <TableCell>{row.from == this.state.address ? "out" : "in"}</TableCell>
                                        <TableCell>{row.to}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            </Grid>
        )
    }
}

export default AddressPage;
