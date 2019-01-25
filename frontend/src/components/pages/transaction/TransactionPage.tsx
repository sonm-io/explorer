import * as React from "react";

import Grid from "@material-ui/core/Grid/Grid";
import {Link} from "src/components/common/link";
import {Transaction} from "src/types/Transaction";
import {IItemProps} from "src/components/factories/item";
import Header from "src/components/common/header";
import SectionName from 'src/components/common/grid-section-name';
import Label from 'src/components/common/grid-label';
import Value from 'src/components/common/grid-value';
import {definedAddresses, isAddressExists as isContract} from 'src/types/Address';

interface ITransactionPageProps extends IItemProps<Transaction> {
}

export class TransactionPage extends React.Component<ITransactionPageProps, never> {
    private renderMain(item: Transaction) {
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

                    <Label>Value</Label>
                    <Value>{item.value}</Value>

                    <SectionName>Transaction fee</SectionName>
                    <Label>Gas Limit</Label>
                    <Value>{item.gas}</Value>
                    <Label>Gas Used</Label>
                    <Value>{item.gasUsed}</Value>
                    <Label>Gas Price</Label>
                    <Value>{item.gasPrice}</Value>
                </Grid>
            </div>
        );
    }

    public render() {
        const p = this.props;
        return p.data !== undefined
            ? this.renderMain(p.data)
            : null;
    }
}
