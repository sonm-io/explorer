import * as React from "react";

import Grid from "@material-ui/core/Grid/Grid";
import {Link} from "src/components/common/link";
import { Block } from "src/types/Block";
import { IItemProps } from "src/components/factories/item";
import Header from "src/components/common/header";
import Label from 'src/components/common/grid-label';
import Value from 'src/components/common/grid-value';
import './block-page.less';

interface IBlockPageProps extends IItemProps<Block> {}

export class BlockPage extends React.Component<IBlockPageProps> {
    private renderMain(item: Block) {
        return (
            <div>
                <div className="head-container">
                    <Header title="Block details" />
                </div>
                <Grid
                    className="content-container"
                    container
                    spacing={16}
                >
                    <Label>Height</Label>
                    <Value>{item.number}</Value>
                    <Label>Hash</Label>
                    <Value>{item.hash}</Value>
                    <Label>Timestamp</Label>
                    <Value>{item.Timestamp}</Value>
                    <Label>Transactions</Label>
                    <Value>
                        <Link to={'/transactions/block-' + item.number}>{item.txCount}</Link>
                    </Value>
                    <Label className="block-page__section-begin">Parent Hash</Label>
                    <Value className="block-page__section-begin">
                        <Link to={"/block/" + String(item.number - 1)}>
                            {item.parentHash}
                        </Link>
                    </Value>
                    <Label>Gas Used</Label>
                    <Value>{item.gasUsed} ({item.gasUsedPerc.toFixed(2)}%)</Value>
                    <Label>Gas Limit</Label>
                    <Value>{item.gasLimit}</Value>
                    <Label>Mined by</Label>
                    <Value>
                        <Link to={'/address/' + item.miner}>{item.miner}</Link>
                    </Value>
                    <Label>Nonce</Label>
                    <Value>{item.nonce}</Value>
                    <Label>Size</Label>
                    <Value>{item.size} bytes</Value>
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
