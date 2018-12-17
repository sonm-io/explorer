import * as React from "react";

import Grid from "@material-ui/core/Grid/Grid";
import {Link} from "react-router-dom";
import { Block } from "src/types/Block";
import { IItemProps } from "src/components/factories/item";
import Header from "src/components/common/header";
import Label from 'src/components/common/grid-label';
import Value from 'src/components/common/grid-value';

interface IBlockPageProps extends IItemProps<Block> {}

export class BlockPage extends React.Component<IBlockPageProps> {
    private renderMain(item: Block) {
        return (
            <div>
                <Header title="Block details" />
                <Grid container spacing={16}>
                    <Label>Height</Label>
                    <Value>{item.number}</Value>
                    <Label>Hash</Label>
                    <Value>{item.hash}</Value>
                    <Label>Timestamp</Label>
                    <Value>{item.timestamp}</Value>
                    <Label>Transactions</Label>
                    <Value>{item.txCount}</Value>
                    <Label>Parent Hash</Label>
                    <Value>
                        <Link to={"/block/" + String(item.number - 1)}>
                            {item.parentHash}
                        </Link>
                    </Value>
                    <Label>Gas Used</Label>
                    <Value>{item.gasUsed}</Value>
                    <Label>Gas Limit</Label>
                    <Value>{item.gasLimit}</Value>
                    <Label>Mined by</Label>
                    <Value>{item.miner}</Value>
                    <Label>Nonce</Label>
                    <Value>{item.nonce}</Value>
                    <Label>Size</Label>
                    <Value>{item.size}</Value>
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
