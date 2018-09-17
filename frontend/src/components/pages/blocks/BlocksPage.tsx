import * as React from "react";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import {Link} from "react-router-dom";
import {Block} from "../../../types/Block";
import {WithStyles} from "@material-ui/core";
import TableFooter from "@material-ui/core/TableFooter/TableFooter";
import TablePagination from "@material-ui/core/TablePagination/TablePagination";
import {TablePaginationActionsWrapped} from "./parts/TablePaginationActions";


interface BlocksState {
    blocks: Block[];
    loading: boolean;
    page: number,
    rowsPerPage: number,
    error?: never;
}

class BlocksPage extends React.Component<WithStyles, BlocksState> {
    state = {
        blocks: [],
        loading: false,
        page: 0,
        rowsPerPage: 15,
    } as BlocksState;

    componentDidMount() {
        this.loadBlocks()
    }

    loadBlocks() {
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
                    page: 0,
                    rowsPerPage: 15,
                    loading: true,
                    error: error,
                } as BlocksState)
            })
    }


    handleChangePage(event: any, page: number) {
        console.log("current page: ", page);
        this.state.page = page;
    }

    handleChangeRowsPerPage() {

    }

    render() {
        const {rowsPerPage, page} = this.state;

        if (this.state.error != null) {
            return (
                <Paper>
                    <h1>error!</h1>
                </Paper>
            )
        }

        return (
            <Table>
                <TableHead>
                    <TableRow>
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
                                <TableCell>
                                    <Link to={"/block/" + row.hash}>{row.number}</Link>
                                </TableCell>
                                <TableCell>{row.timestamp}</TableCell>
                                <TableCell>{row.txCount}</TableCell>
                                <TableCell>{row.gasUsed}</TableCell>
                                <TableCell>{row.gasLimit}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            colSpan={3}
                            count={this.state.blocks.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActionsWrapped}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        )
    }
}


export default BlocksPage;
