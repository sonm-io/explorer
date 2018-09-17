import * as React from "react";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import {Link} from "react-router-dom";
import {Block} from "../../../types/Block";
import {Theme, WithStyles} from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import TableFooter from "@material-ui/core/TableFooter/TableFooter";
import TablePagination from "@material-ui/core/TablePagination/TablePagination";
import IconButton from "@material-ui/core/IconButton/IconButton";
import LastPageIcon from '@material-ui/icons/LastPage';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";

const actionsStyles = (theme: Theme) => createStyles({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing.unit * 2.5,
    },
});


interface TablePaginationActionsProps extends WithStyles {
    classes: {
        root: string
    }
    count: number,
    page: number,
    rowsPerPage: number,

    onChangePage(event: any, page: number): void,
}

class TablePaginationActions extends React.Component<TablePaginationActionsProps, any> {

    handleFirstPageButtonClick(event: any) {
        this.props.onChangePage(event, 0);
    };

    handleBackButtonClick(event: any) {
        this.props.onChangePage(
            event,
            this.props.page - 1
        );
    };

    handleNextButtonClick(event: any) {
        this.props.onChangePage(
            event,
            this.props.page + 1);
    };

    handleLastPageButtonClick(event: any) {
        this.props.onChangePage(
            event,
            Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
        );
    };

    render() {
        const {classes, count, page, rowsPerPage} = this.props;

        return (
            <div className={classes.root}>
                <IconButton
                    onClick={this.handleFirstPageButtonClick}
                    disabled={page === 0}
                    aria-label="First Page"
                >
                    <FirstPageIcon/>

                </IconButton>
                <IconButton
                    onClick={this.handleBackButtonClick}
                    disabled={page === 0}
                    aria-label="Previous Page"
                >
                    <KeyboardArrowLeft/>
                </IconButton>
                <IconButton
                    onClick={this.handleNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Next Page"
                >
                    <KeyboardArrowRight/>
                </IconButton>
                <IconButton
                    onClick={this.handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Last Page"
                >
                    <LastPageIcon/>
                </IconButton>
            </div>
        );
    }
}


const TablePaginationActionsWrapped = withStyles(actionsStyles)(TablePaginationActions);


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
                                    <TableCell className={"tableCell"} numeric>
                                        <Link to={"/block/" + row.hash}>{row.number}</Link>
                                    </TableCell>
                                    <TableCell className={"tableCell"} numeric>{row.timestamp}</TableCell>
                                    <TableCell className={"tableCell"} numeric>{row.txCount}</TableCell>
                                    <TableCell className={"tableCell"} numeric>{row.gasUsed}</TableCell>
                                    <TableCell className={"tableCell"} numeric>{row.gasLimit}</TableCell>
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
}

const styles = (theme: Theme) => createStyles({
    tableCell: {
        textAlign: "left",
    }
});

export default withStyles(styles)(BlocksPage);
