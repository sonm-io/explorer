import * as ethJsAbi from 'ethjs-abi';
import { BalanceUtils } from 'src/utils/balance-utils';
import * as dateFormat from 'dateformat';

const remove24LeadingZeros = (addr: string) => {
    return '0x' + addr.substring(2+24);
};

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
    public timestamp: string;

    public get Value() {
        if (this.value === 0) {
            return '';
        } else {
            const bn = ethJsAbi.decodeParams(['uint256'], '0x' + this.value)[0];
            return BalanceUtils.formatBalance(bn.toString());
        }
    }

    public get From() {
        return this.gas === undefined
            ? remove24LeadingZeros(this.from)
            : this.from;
    }

    public get To() {
        return this.gas === undefined
            ? remove24LeadingZeros(this.to)
            : this.to;
    }

    public get Timestamp() {
        const date = new Date(this.timestamp);
        return dateFormat(date, 'dd mmm yyyy HH:MM:ss');
    }
}
