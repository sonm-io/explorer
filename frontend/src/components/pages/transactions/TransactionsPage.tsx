import * as React from "react";

import Table from "@material-ui/core/Table/Table";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableFooter from "@material-ui/core/TableFooter/TableFooter";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TablePagination from "@material-ui/core/TablePagination/TablePagination";
import TableRow from "@material-ui/core/TableRow/TableRow";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { Link } from "react-router-dom";
import { Transaction } from "src/types/Transaction";
import { tablePaginationActionsWrapped } from "../blocks/parts/TablePaginationActions"; // ToDo: why we use this generic component from blocks? possibly it must be extracted from blocks.
import { IListProps } from 'src/components/factories/list';
import { PagedList } from "src/components/generic/PagedList";
import { ITransactions, TTransactionsShow } from "src/stores/transactions-store";

export interface ITransactionsPageProps extends ITransactions, IListProps<Transaction, ITransactions> {}

export class TransactionsPage extends PagedList<Transaction, ITransactionsPageProps> {
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

    private handleChangeShow = (event: any, value: TTransactionsShow) => {
        this.props.updateRoute({ show: value });
    }

    public render = () => {
        const p = this.props;
        return (
            <div>
                {p.address !== undefined ? this.renderHeader() : null}
                <ToggleButtonGroup
                    exclusive={true}
                    value={p.show}
                    onChange={this.handleChangeShow}
                >
                    <ToggleButton value="transactions">
                        Transactions
                    </ToggleButton>
                    <ToggleButton value="token-trns">
                        SONM token txns
                    </ToggleButton>
                </ToggleButtonGroup>

                {this.renderTable()}
            </div>
        );
    }
}
