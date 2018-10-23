import * as React from "react";

import Grid from "@material-ui/core/Grid/Grid";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableRow from "@material-ui/core/TableRow/TableRow";
import {Link} from "react-router-dom";
import {definedAddressesMap} from "../../../types/Address";

class ContractsPage extends React.Component {
    public render() {
        return (
            <div>
                <h1 style={{padding: 16}}>Contracts page</h1>

                <Paper style={{padding: 16}}>
                    <Grid container spacing={16}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell key={"0x0000000000000000000000000000000000000000"}>
                                        <Link to={"/address/" + "0x0000000000000000000000000000000000000000"}>
                                            0x0000000000000000000000000000000000000000
                                        </Link>
                                    </TableCell>
                                </TableRow>
                                {/*this.state.transactions.map((row) => {*/}
                                {definedAddressesMap.map((row) => {
                                    console.log(row);
                                    return (
                                        <TableRow key={row.name}>
                                            <TableCell>
                                                <Link to={"/address/" + row.address}>{row.name}</Link>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Grid>
                </Paper>
            </div>
        );
    }
}

export default ContractsPage;
