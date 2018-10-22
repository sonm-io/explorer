import * as React from "react";

import Table from "@material-ui/core/Table/Table";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableFooter from "@material-ui/core/TableFooter/TableFooter";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TablePagination from "@material-ui/core/TablePagination/TablePagination";
import TableRow from "@material-ui/core/TableRow/TableRow";
import {tablePaginationActionsWrapped} from "./parts/TablePaginationActions";

import {Link} from "react-router-dom";
import {Block} from "../../../types/Block";

import ErrorForm from "../../errors/Error";
import Loader from "../../loader/Loader";

import {WithStyles} from "@material-ui/core";
import {ENDPOINT} from "../../../App";

interface BlocksState {
    blocks: Block[];
    loading: boolean;
    page: number;
    rowsPerPage: number;
    error?: string;
}

const START_PAGE = 0;
const DEFAULT_ROWS_PER_PAGE = 10;

class BlocksPage extends React.Component<WithStyles, BlocksState> {
    constructor(props: any) {
        super(props);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.loadBlocks = this.loadBlocks.bind(this);
    }

    public state = {
        blocks: [],
        loading: false,
        page: START_PAGE,
        rowsPerPage: DEFAULT_ROWS_PER_PAGE,
    } as BlocksState;

    public componentDidMount() {
        this.loadBlocks();
    }

    public loadBlocks() {
        console.log(this.state);
        const offset = this.state.rowsPerPage * this.state.page;
        const limit = this.state.rowsPerPage;
        const url = ENDPOINT + "/blocks?order=number.desc&limit=" + limit + "&offset=" + offset;
        console.log(url);
        fetch(url)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(res.statusText);
                }
                return res.json();
            })
            .then(
                (result) => {
                    this.setState({
                        blocks: result,
                        loading: true,
                    } as BlocksState);
                }
            )
            .catch((error) => {
                this.setState({
                    blocks: [],
                    page: 1,
                    rowsPerPage: 15,
                    loading: true,
                    error: error.toString(),
                } as BlocksState);
            });
    }

    public handleChangePage(event: any, page: number) {
        this.setState({
            page,
            loading: false,
        } as BlocksState, this.loadBlocks);
    }

    public handleChangeRowsPerPage() {

    }

    public render() {
        if (this.state.error != null) {
            return (
                <ErrorForm error={this.state.error}/>
            );
        }

        if (!this.state.loading) {
            return (
                <Loader/>
            );
        }

        const {rowsPerPage, page} = this.state;

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
                    {this.state.blocks.map((row) => {
                        return (
                            <TableRow key={row.number}>
                                <TableCell>
                                    <Link to={"/block/" + row.number}>{row.number}</Link>
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
                            count={2000000}
                            // TODO: load state before & in time:
                            // колличество блоков будет постоянно меняться
                            // при использовании offset на страницу будут догружаться
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            ActionsComponent={tablePaginationActionsWrapped}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        );
    }
}

export default BlocksPage;
