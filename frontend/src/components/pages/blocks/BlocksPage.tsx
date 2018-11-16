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

import ErrorForm from "../../errors/Error";
import Loader from "../../loader/Loader";

import { Block } from 'src/types/Block';
import { IList } from 'src/stores/paged-list/types';

export class BlocksPage extends React.Component<IList<Block>> {

    private handleChangePage = (event: any, page: number) => {
        this.props.fetch(page);
    }

    private handleChangePageSize = (event: any) => {
        this.props.changePageSize(event.target.value);
    }

    private renderMain() {
        const p = this.props;
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
                    {p.list.map((row) => {
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
                            rowsPerPage={p.pageSize}
                            page={p.page}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangePageSize}
                            ActionsComponent={tablePaginationActionsWrapped}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        );
    }

    public render() {
        const p = this.props;
        return p.error !== undefined
            ? <ErrorForm error={p.error}/>
            : p.loading
            ? <Loader/>
            : this.renderMain();
    }
}
