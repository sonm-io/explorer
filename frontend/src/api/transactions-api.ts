import {fetchData, getQuery, IQueryParam} from './base';
import {Transaction} from 'src/types/Transaction';

export type TTransactionsShow = 'transactions' | 'token-trns';

export interface ITransactionsFilter {
    show: TTransactionsShow;
    address?: string;
    block?: number;
}

// ToDo: extract 'show' and 'address' to filter object.

const addAddrParam = (params: IQueryParam[], address?: string) => {
    if (address !== undefined) {
        const addrLower = address.toLowerCase();
        params.push({name: 'or', value: `(from.eq.${addrLower},to.eq.${addrLower})`});
    }
};

const append24zeros = (address: string) => {
    const addrLower = address.toLowerCase();
    return '0x' + Array(24 + 1).join('0') + addrLower.substring(2);
};

const getEndpoint = (filter: ITransactionsFilter): string => {
    return filter.show === 'transactions'
        ? 'transactions?'
        : 'rpc/token_transfers?';
};

const getParams = (filter: ITransactionsFilter): IQueryParam[] => {
    const params: IQueryParam[] = [];
    if (filter.show === 'transactions') {
        addAddrParam(params, filter.address);
        if (filter.block !== undefined) {
            params.push({name: 'blockNumber', value: `eq.${filter.block}`});
        }
    } else {
        if (filter.address !== undefined) {
            params.push({name: 'address', value: append24zeros(filter.address)});
        }
        if (filter.block !== undefined) {
            params.push({name: 'blocknumber', value: `${filter.block}`});
        }
    }
    return params;
};

const addOrder = (params: IQueryParam[], filter: ITransactionsFilter) => {
    if (filter.show === 'transactions') {
        params.push({name: 'order', value: 'blockNumber.desc'});
    } else {
        params.push({name: 'order', value: 'timestamp.desc'});
    }
    return params;
};

const addPaging = (params: IQueryParam[], filter: ITransactionsFilter, page: number, pageSize: number) => {
    const offset = pageSize * page;
    const limit = pageSize;

    if (filter.show === 'transactions') {
        params.push({name: 'offset', value: offset});
        params.push({name: 'limit', value: limit});
    } else {
        params.push({name: 'skip', value: offset});
        params.push({name: 'size', value: limit});
        params.push({name: 'limit', value: limit});
    }
    return params;
};

export const transactionsPage = async (
    page: number,
    pageSize: number,
    show: TTransactionsShow,
    address?: string,
    block?: number,
) => {
    const filter: ITransactionsFilter = {show, address, block};
    const tpl = getEndpoint(filter);
    const params = getParams(filter);
    addOrder(params, filter);
    addPaging(params, filter, page, pageSize);
    const query = getQuery(tpl, params);
    const data = await fetchData(query);
    return typeof (data) === 'object' ? data.map((row: any) => new Transaction(row)) : data;
};

export const transactionsCount = async (show: TTransactionsShow, address?: string, block?: number) => {
    const filter: ITransactionsFilter = {show, address, block};

    if (show === 'transactions') {
        const params = getParams(filter);
        params.push({name: 'select', value: 'count'});
        params.push({name: 'limit', value: 1});
        const query = getQuery('transactions?', params);
        return fetchData(query);
    } else {
        const params = getParams(filter);
        params.push({name: 'limit', value: 1});
        const query = getQuery('rpc/token_transfers_count?', params);
        return fetchData(query);
    }
};

const TOKEN_TRANSFER = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

export const transactionTransfers = async (hash: string) => {
    const data = await fetchData(`logs?txHash=eq.${hash}&firstTopic=eq.${TOKEN_TRANSFER}`);
    return typeof (data) === 'object' ? data.map((row: any) => new Transaction(row)) : data;
};

export const transaction = async (hash: string) => {
    const data = await fetchData(`transactions?hash=eq.${hash}&limit=1`);
    const tokenTransfers = await transactionTransfers(hash);
    if (data.length === 0) {
        return undefined; // Not found
    } else if (typeof(data) === 'object' && typeof(data.message) === 'string') {
        return data.message; // postgrest error message
    }
    return new Transaction(data[0], tokenTransfers);
};
