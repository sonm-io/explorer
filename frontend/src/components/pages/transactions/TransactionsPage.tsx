import * as React from "react";

import Table from "@material-ui/core/Table/Table";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableFooter from "@material-ui/core/TableFooter/TableFooter";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TablePagination from "@material-ui/core/TablePagination/TablePagination";
import TableRow from "@material-ui/core/TableRow/TableRow";
import { Link } from "react-router-dom";
import { Transaction } from "src/types/Transaction";
import Loader from "src/components/elements/loader/Loader";
import { tablePaginationActionsWrapped } from "../blocks/parts/TablePaginationActions"; // ToDo: why we use this generic component from blocks? possibly it must be extracted from blocks.
import { IList } from 'src/components/factories/list';

export interface ITransactionsPageProps extends IList<Transaction> {
    address?: string;
}

export class TransactionsPage extends React.Component<ITransactionsPageProps, never> {

    private handleChangePage = (event: any, page: number) => {
        this.props.update({page});
    }

    private handleChangePageSize = (event: any) => {
        this.props.update({ pageSize: event.target.value });
    }

    private renderTable = () => {
        const p = this.props;
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>TxHash</TableCell>
                        <TableCell>Block</TableCell>
                        <TableCell>From</TableCell>
                        <TableCell>To</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {p.list.map((row) => {
                        return (
                            <TableRow key={row.hash}>
                                <TableCell>
                                    <Link to={"/transaction/" + row.hash}>{row.hash}</Link>
                                </TableCell>
                                <TableCell>
                                    <Link to={"/block/" + row.blockHash}>{row.blockNumber}</Link>
                                </TableCell>
                                <TableCell>
                                    <Link to={"/address/" + row.from}>{row.from}</Link>
                                </TableCell>
                                <TableCell>
                                    <Link to={"/address/" + row.to}>{row.to}</Link>
                                </TableCell>
                                <TableCell>
                                    {row.status ? "success" : "fail"}
                                </TableCell>
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
                            // колличество транзакций будет постоянно меняться
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

    private renderHeader = () => {
        const p = this.props;
        return (
            <h1 style={{padding: 16}}>Address - {p.address}</h1>
        );
    }

    private renderMain = () => {
        const p = this.props;
        return (
            <div>
                {p.address !== undefined ? this.renderHeader() : null}
                {this.renderTable()}
            </div>
        );
    }

    public render() {
        const p = this.props;
        return p.pendingSet.size > 0
            ? <Loader/>
            : this.renderMain();
    }
}
