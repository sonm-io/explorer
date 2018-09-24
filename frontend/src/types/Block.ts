export class Block {
    number: number;
    hash: string;
    parentHash: string;
    nonce: string;
    sha3Uncles: string;
    logsBloom: string;
    transactionsRoot: string;
    stateRoot: string;
    receiptsRoot: string;
    miner: string;
    difficulty: number;
    totalDifficulty: number;
    size: number;
    extraData: string;
    gasLimit: number;
    gasUsed: number;
    timestamp: number;
    mixhash: string;
    txCount: number;
}
