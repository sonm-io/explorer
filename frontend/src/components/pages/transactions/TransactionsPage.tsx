import * as React from "react";

import Table from "@material-ui/core/Table/Table";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableCell from "src/components/common/table-cell";
import TableFooter from "@material-ui/core/TableFooter/TableFooter";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TablePagination from "@material-ui/core/TablePagination/TablePagination";
import TableRow from "@material-ui/core/TableRow/TableRow";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { Link } from "src/components/common/link";
import { Transaction } from "src/types/Transaction";
import { tablePaginationActionsWrapped } from "../blocks/parts/TablePaginationActions"; // ToDo: why we use this generic component from blocks? possibly it must be extracted from blocks.
import { IListProps } from 'src/components/factories/list';
import { PagedList } from "src/components/generic/PagedList";
import { ITransactions, TTransactionsShow } from "src/stores/transactions-store";
import { Toolbar } from "@material-ui/core";
import ToggleButtonGroup from 'src/components/common/toggle-button-group';
import DateTimePicker from 'src/components/common/datetime-picker';
import { AddressInfo } from './parts/address-info';
import InSvg from './parts/in.svg';
import OutSvg from './parts/out.svg';
import { isAddressExists as isContract } from 'src/types/Address';
import './transactions-page.less';

export interface ITransactionsPageProps extends ITransactions, IListProps<Transaction, ITransactions> {}

const prefix = (prefix: string) => {
    return (value: string) => prefix + value;
};

const css = prefix('transactions-page__');

export class TransactionsPage extends PagedList<Transaction, ITransactionsPageProps> {

    private static togglerItems: Array<[string, string]> = [
        ['transactions', 'Transactions'],
        ['token-trns', 'SONM token txns'],
    ];

    private renderAddress = (address: string) => {
        return this.props.address === address
            ? <span>{address}</span>
            : <Link to={"/address/" + address}>{address}</Link>;
    }

    private renderDirectionIcon = (from: string, to: string) => {
        return this.props.address === from
            ? <OutSvg />
            : this.props.address === to
            ? <InSvg />
            : <ArrowForwardIcon className="transactions-page__arrow" />;
    }

    private renderTable = () => {
        const p = this.props;
        console.log(ArrowForwardIcon);
        console.log(InSvg);
        console.log(OutSvg);
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>TxHash</TableCell>
                        <TableCell>Block</TableCell>
                        <TableCell className={css('cell-from')}>From</TableCell>
                        <TableCell className={css('cell-arrow')}></TableCell>
                        <TableCell className={css('cell-to')}>To</TableCell>
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
                                <TableCell className={css('cell-from')}>
                                    {this.renderAddress(row.from)}
                                </TableCell>
                                <TableCell className={css('cell-arrow')}>
                                    {this.renderDirectionIcon(row.from, row.to)}
                                </TableCell>
                                <TableCell className={css('cell-to')}>
                                    {this.renderAddress(row.to)}
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

    private renderAddressHeader = (header: string) => {
        const p = this.props;
        return (
            <React.Fragment>
                <h1>{header}</h1>
                <AddressInfo address={p.address||''} transactionsCount={1000} />
            </React.Fragment>
        );
    }

    private renderHeader = () => {
        const address = this.props.address;
        return address === undefined
            ? <h1>Transactions</h1>
            : this.renderAddressHeader(
                isContract(address)
                    ? 'Contract details'
                    : 'Address details'
            );
    }

    private handleChangeShow = (event: any, value: TTransactionsShow) => {
        this.props.updateRoute({ show: value });
    }

    private handleChangeDate = (value?: Date) => {
        this.props.update({ date: value });
    }

    public render = () => {
        const p = this.props;
        return (
            <div>
                {this.renderHeader()}
                <ToggleButtonGroup
                    items={TransactionsPage.togglerItems}
                    value={p.show}
                    onChange={this.handleChangeShow}
                />
                <Toolbar disableGutters>
                    <DateTimePicker
                        value={p.date}
                        onChange={this.handleChangeDate}
                    />
                </Toolbar>
                {this.renderTable()}
            </div>
        );
    }
}
