import * as React from "react";

import Table from "@material-ui/core/Table/Table";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableCell from "src/components/common/table-cell";
import TableFooter from "@material-ui/core/TableFooter/TableFooter";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TablePagination from "@material-ui/core/TablePagination/TablePagination";
import TableRow from "@material-ui/core/TableRow/TableRow";
import {tablePaginationActionsWrapped} from "./parts/TablePaginationActions";
import {Link} from "src/components/common/link";
import { Block } from 'src/types/Block';
import { IListProps } from 'src/components/factories/list';
import { PagedList } from "src/components/generic/PagedList";
import Header from "src/components/common/header";
import { Toolbar } from "@material-ui/core";
import DateTimePicker from 'src/components/common/datetime-picker';
import { IBlocks } from "src/stores/blocks-store";
import { isValidDate } from "src/utils/common";

export interface IBlocksPageProps extends IBlocks, IListProps<Block, IBlocks> {}

export class BlocksPage extends PagedList<Block, IBlocksPageProps> {

    private handleChangeDate = (value?: Date) => {
        const v = isValidDate(value) ? value : undefined;
        this.props.update({ date: v, page: 1 });
    }

    public renderTable() {
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
                                <TableCell>{row.utcDate}</TableCell>
                                <TableCell>
                                    <Link to={'/transactions/block-' + row.number}>{row.txCount}</Link>
                                </TableCell>
                                <TableCell>{row.gasUsed}</TableCell>
                                <TableCell>{row.gasLimit}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
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
        return (
            <div>
                <div className="head-container">
                    <Header title="Blocks" />
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
