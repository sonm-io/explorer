import * as React from 'react';
import Grid from "@material-ui/core/Grid/Grid";
import {Link} from "src/components/common/link";
import {Transaction} from "src/types/Transaction";
import Header from "src/components/common/header";
import SectionName from 'src/components/common/grid-section-name';
import Label from 'src/components/common/grid-label';
import Value from 'src/components/common/grid-value';
import {definedAddresses, isAddressExists as isContract} from 'src/types/Address';
import { IItemData } from 'src/components/factories/item';
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "src/components/common/table-cell";

interface IInputData {
    methodId: string;
    params: string[];
}

export class TransactionItem extends React.Component<IItemData<Transaction>, never> {

    private static getInputParams = (input: string) => {
        const params: string[] = [];

        let i = 8;
        while (i < input.length) {
            params.push(input.substr(i, 64));
            i += 64;
        }
        return params;
    }

    private getInputData = (): IInputData =>  {
        const input = this.props.data.input;
        return {
            methodId: input.substring(0, 8),
            params: TransactionItem.getInputParams(input)
        };
    }

    private renderInputData() {
        const input = this.getInputData();
        return (
            <React.Fragment>
                <Label></Label>
                <Value>MethodID: {input.methodId}</Value>
                {
                    input.params.map((p, i) => {
                        return (
                            <React.Fragment key={i}>
                                <Label></Label>
                                <Value>[{i}]: {p}</Value>
                            </React.Fragment>
                        );
                    })
                }
            </React.Fragment>
        );
    }

    private renderTokenTransfers() {
        const item = this.props.data;
        if (item.tokenTransfers.length === 0) {
            return null;
        }
        return (
            <div className="content-container">
                <h3>Token transfers</h3>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>From</TableCell>
                            <TableCell>To</TableCell>
                            <TableCell>Value, SNM</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            item.tokenTransfers.map((tt, i) => {
                                return (
                                    <TableRow key={i}>
                                        <TableCell><Link to={"/address/" + tt.from}>{tt.from}</Link></TableCell>
                                        <TableCell><Link to={"/address/" + tt.to}>{tt.to}</Link></TableCell>
                                        <TableCell>{tt.value}</TableCell>
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            </div>
        );
    }

    public render() {
        const item = this.props.data;
        return (
            <div className="transaction">
                <div className="head-container">
                    <Header title="Transaction details"/>
                </div>
                <Grid className="content-container" container spacing={16}>
                    <SectionName>Transaction info</SectionName>

                    <Label>Hash</Label>
                    <Value>{item.hash}</Value>

                    <Label>Block</Label>
                    <Value>
                        <Link to={"/block/" + item.blockNumber}>
                            {item.blockNumber}
                        </Link>
                    </Value>

                    <Label>Date</Label>
                    <Value>
                        {item.Timestamp}
                    </Value>

                    <Label>Status</Label>
                    <Value>
                        {item.status
                            ? "Success"
                            : "Failed"
                        }
                    </Value>

                    <Label>From</Label>
                    <Value>
                        <Link to={"/address/" + item.from}>
                            {isContract(item.from)
                                ? definedAddresses[item.from].name
                                : item.from
                            }
                        </Link>
                    </Value>

                    <Label>To</Label>
                    <Value>
                        <Link to={"/address/" + item.to}>
                            {isContract(item.to)
                                ? definedAddresses[item.to].name
                                : item.to
                            }
                        </Link>
                    </Value>

                    <Label>Nonce | {'{'} Position {'}'}</Label>
                    <Value>{`${item.nonce} { ${item.transactionIndex} }`}</Value>

                    <SectionName>Transaction fee</SectionName>
                    <Label>Gas Limit</Label>
                    <Value>{item.gas}</Value>
                    <Label>Gas Used</Label>
                    <Value>{item.gasUsed}</Value>
                    <Label>Gas Price</Label>
                    <Value>{item.gasPrice}</Value>

                    <SectionName>Input data</SectionName>
                    {this.renderInputData()}
                </Grid>
                {this.renderTokenTransfers()}
            </div>
        );
    }
}
