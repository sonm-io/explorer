import * as ethJsAbi from 'ethjs-abi';
import { BalanceUtils } from 'src/utils/balance-utils';
import * as dateFormat from 'dateformat';

export interface ITokenTransfer {
    from: string;
    to: string;
    value: string;
}

const remove24LeadingZeros = (addr: string) => {
    return '0x' + addr.substring(2+24);
};

const valueToNumber = (str: string | number): string => {
    if (str === 0) {
        return '';
    } else {
        const bn = ethJsAbi.decodeParams(['uint256'], '0x' + str)[0];
        return BalanceUtils.formatBalance(bn.toString());
    }
};

const logRecordToTokenTransfer = (log: any): ITokenTransfer => {
    return {
        from: remove24LeadingZeros(log.secondTopic),
        to: remove24LeadingZeros(log.thirdTopic),
        value: valueToNumber(log.firstArg)
    };
};

export class Transaction {
    constructor(data: any, tokenTransfers?: object[]) {
        Object.assign(this, data);
        this.tokenTransfers = tokenTransfers === undefined
            ? []
            : tokenTransfers.map(logRecordToTokenTransfer);
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
    public tokenTransfers: ITokenTransfer[];

    public get Value() {
        return valueToNumber(this.value);
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
