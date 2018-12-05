export class Transaction { // ToDo convert to interface
    public hash: string;
    public nonce: number;
    public blockHash: string;
    public blockNumber: number;
    public transactionIndex: number;
    public from: string;
    public to: string;
    public value: number;
    public gas: number;
    public gasPrice: number;
    public input: string;
    public v: string;
    public r: string;
    public s: string;
    public status: boolean;
}
