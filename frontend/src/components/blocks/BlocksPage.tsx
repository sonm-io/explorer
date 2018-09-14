import * as React from "react";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import {Link} from "react-router-dom";
import {Block} from "../../types/Block";
import createStyles from "@material-ui/core/styles/createStyles";
import {Theme} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";

interface BlocksState {
    blocks: Block[];
    loading: boolean;
    error?: never;
}

class BlocksPage extends React.Component<any, BlocksState> {
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
                <Table>
                    <TableHead>
                        <TableRow hover={true}>
                            <TableCell variant={"head"}>Height</TableCell>
                            <TableCell variant={"head"}>Age</TableCell>
                            <TableCell variant={"head"}>Txn</TableCell>
                            <TableCell variant={"head"}>GasUsed</TableCell>
                            <TableCell variant={"head"}>GasLimit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.blocks.map(row => {
                            return (
                                <TableRow key={row.number}>
                                    <TableCell numeric><Link
                                        to={"/block/" + row.hash}>{row.number}</Link></TableCell>
                                    <TableCell numeric>{row.timestamp}</TableCell>
                                    <TableCell numeric>{row.txCount}</TableCell>
                                    <TableCell numeric>{row.gasUsed}</TableCell>
                                    <TableCell numeric>{row.gasLimit}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            )
        }
    }
}

const styles = (theme: Theme) => createStyles({

});

export default withStyles(styles)(BlocksPage);
