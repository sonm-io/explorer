import * as ethJsAbi from 'ethjs-abi';
import { BalanceUtils } from 'src/utils/balance-utils';
export class Transaction {
    constructor(data: any) {
        Object.assign(this, data);
    }
    public hash: string;
    public nonce: number;
    public blockHash: string;
    public blockNumber: number;
    public transactionIndex: number;
    public from: string;
    public to: string;
    public value: number | string;
    public gas: number;
    public gasUsed: number;
    public gasPrice: number;
    public input: string;
    public v: string;
    public r: string;
    public s: string;
    public status: boolean;

    public get valueFmtd() {
        if (this.value === 0) {
            return '';
        } else {
            const bn = ethJsAbi.decodeParams(['uint256'], '0x' + this.value)[0];
            return BalanceUtils.formatBalance(bn.toString());
        }
    }
}
