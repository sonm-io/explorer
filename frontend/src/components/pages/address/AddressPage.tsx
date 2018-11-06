import * as React from "react";

import Grid from "@material-ui/core/Grid/Grid";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import {Link} from "react-router-dom";
import {EndpointAddr} from "src/config";
import {Transaction} from "../../../types/Transaction";

import TableFooter from "@material-ui/core/TableFooter/TableFooter";
import TablePagination from "@material-ui/core/TablePagination/TablePagination";
import {tablePaginationActionsWrapped} from "../blocks/parts/TablePaginationActions";

import ErrorForm from "../../errors/Error";
import Loader from "../../loader/Loader";

interface AddressState {
    address: string;
    loading: boolean;
    transactions: Transaction[];
    error?: string;

    page: number;
    rowsPerPage: number;
}

const START_PAGE = 0;
const DEFAULT_ROWS_PER_PAGE = 10;

class AddressPage extends React.Component<any, AddressState> {
    constructor(props: any) {
        super(props);

        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.loadTransactions = this.loadTransactions.bind(this);
    }

    public state = {
        address: this.props.match.params.address,
        loading: false,
        transactions: [],
        page: START_PAGE,
        rowsPerPage: DEFAULT_ROWS_PER_PAGE,
    } as AddressState;

    public componentDidMount() {
        this.loadTransactions();
    }

    public loadTransactions() {
        const limit = this.state.rowsPerPage;
        const offset = this.state.page * this.state.rowsPerPage;
        const url = EndpointAddr + "/transactions?select=*&limit=" + limit + "&offset=" + offset + "&or=(from.eq." + this.state.address + ",to.eq." + this.state.address + ")&order=nonce.desc";
        console.log(url);
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then((result) => {
                this.setState({
                    transactions: result,
                    loading: true,
                } as AddressState);
            })
            .catch((err) => {
                this.setState({
                    loading: true,
                    error: err,
                } as AddressState);
            });
    }

    public handleChangePage(event: any, page: number) {
        this.setState({
            page,
            loading: false,
        } as AddressState, this.loadTransactions);
    }

    public handleChangeRowsPerPage(event: any) {
        this.setState({
            rowsPerPage: event.target.value,
            loading: false,
        } as AddressState, this.loadTransactions);
    }

    public render() {
        const {page, rowsPerPage} = this.state;

        if (this.state.error != null) {
            const err = this.state.error.toString();
            return (
                <ErrorForm error={err}/>
            );
        }

        if (!this.state.loading) {
            return (
                <Loader/>
            );
        }

        return (
            <Grid>
                <h1 style={{padding: 16}}>Address - {this.state.address}</h1>

                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Hash</TableCell>
                                <TableCell>Block</TableCell>
                                <TableCell>Txn</TableCell>
                                <TableCell>From</TableCell>
                                <TableCell>To</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.transactions.map((row) => {
                                return (
                                    <TableRow key={row.hash}>
                                        <TableCell><Link
                                            to={"/transaction/" + row.hash}>{row.hash}</Link></TableCell>
                                        <TableCell>{row.blockNumber}</TableCell>
                                        <TableCell>{row.from}</TableCell>
                                        <TableCell>{row.from === this.state.address ? "out" : "in"}</TableCell>
                                        <TableCell>{row.to}</TableCell>
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
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onChangePage={this.handleChangePage}
                                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                    ActionsComponent={tablePaginationActionsWrapped}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </Paper>
            </Grid>
        );
    }
}

export default AddressPage;
