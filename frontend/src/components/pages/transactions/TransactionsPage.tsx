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
import { isAddressExists as isContract, definedAddresses } from 'src/types/Address';
import './transactions-page.less';
import Header from "src/components/common/header";
import { prefix } from "src/utils/common";
import DoneImage from '@material-ui/icons/Done';
import HighlightOffImage from '@material-ui/icons/Clear';
import * as cn from 'classnames';

export interface ITransactionsPageProps extends ITransactions, IListProps<Transaction, ITransactions> {}

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
            ? <OutSvg className={cn(css('direction-icon'))} />
            : this.props.address === to
            ? <InSvg className={cn(css('direction-icon'))}  />
            : <ArrowForwardIcon className={cn(css('direction-icon'), css('arrow'))} />;
    }

    private renderTable = () => {
        const p = this.props;
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
                                    <Link to={"/block/" + row.blockNumber}>{row.blockNumber}</Link>
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
                                    {row.status
                                        ? <DoneImage className={cn(css('success'), css('status-icon'))} titleAccess="success" />
                                        : <HighlightOffImage className={cn(css('fail'), css('status-icon'))} titleAccess="failed" />
                                    }
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

    private renderAddressHeader = (header: string, description?: string) => {
        const p = this.props;
        return (
            <React.Fragment>
                <Header title={header} subtitle={description} />
                <AddressInfo address={p.address||''} transactionsCount={p.totalCount} />
            </React.Fragment>
        );
    }

    private renderHeader = () => {
        const address = this.props.address;
        return address === undefined
            ? <Header title="Transactions" />
            : isContract(address)
                ? this.renderAddressHeader('Contract details', definedAddresses[address].name)
                : this.renderAddressHeader('Address details');
    }

    private handleChangeShow = (event: any, value: TTransactionsShow) => {
        this.props.updateRoute({ show: value });
    }

    private handleChangeDate = (value?: Date) => {
        this.props.update({ date: value, page: 1 });
    }

    public render = () => {
        const p = this.props;
        return (
            <div>
                <div className="head-container">
                    {this.renderHeader()}
                    <ToggleButtonGroup
                        className="transactions-page__toggle-group"
                        items={TransactionsPage.togglerItems}
                        value={p.show}
                        onChange={this.handleChangeShow}
                    />
                </div>
                <div className="content-container">
                    <Toolbar disableGutters>
                        <DateTimePicker
                            value={p.date}
                            onChange={this.handleChangeDate}
                        />
                    </Toolbar>
                    {this.renderTable()}
                </div>
            </div>
        );
    }
}
