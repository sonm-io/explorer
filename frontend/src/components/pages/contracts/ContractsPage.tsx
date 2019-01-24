import * as React from "react";

import Grid from "@material-ui/core/Grid/Grid";
import Table from "@material-ui/core/Table/Table";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableCell from "src/components/common/table-cell";
import TableRow from "@material-ui/core/TableRow/TableRow";
import {Link} from "src/components/common/link";
import {definedAddressesMap} from "../../../types/Address";
import { TableHead } from "@material-ui/core";
import Header from "src/components/common/header";

class ContractsPage extends React.Component {
    public render() {
        return (
            <div>
                <div className="head-container">
                    <Header title="Contracts" />
                </div>
                <Grid className="content-container">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Contract name</TableCell>
                                <TableCell>Address</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {definedAddressesMap.map((row) => {
                                return (
                                    <TableRow key={row.name}>
                                        <TableCell>
                                            <Link to={"/address/" + row.address}>{row.name}</Link>
                                        </TableCell>
                                        <TableCell>
                                            <Link to={"/address/" + row.address}>{row.address}</Link>
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
