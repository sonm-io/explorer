import * as React from "react";

import Grid from "@material-ui/core/Grid/Grid";
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
                <h1>Contracts page</h1>

                <Grid>
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
            </div>
        );
    }
}

export default ContractsPage;
