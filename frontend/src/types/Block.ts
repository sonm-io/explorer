export class Block {
    constructor(data: any) {
        Object.assign(this, data);
    }

    public number: number;
    public hash: string;
    public parentHash: string;
    public nonce: string;
    public sha3Uncles: string;
    public logsBloom: string;
    public transactionsRoot: string;
    public stateRoot: string;
    public receiptsRoot: string;
    public miner: string;
    public difficulty: number;
    public totalDifficulty: number;
    public size: number;
    public extraData: string;
    public gasLimit: number;
    public gasUsed: number;
    public timestamp: number;
    public mixhash: string;
    public txCount: number;

    public get gasUsedPerc() {
        return this.gasUsed / this.gasLimit * 100;
    }

    public get utcDate() {
        return new Date(this.timestamp).toUTCString();
    }
}
