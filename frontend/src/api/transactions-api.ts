import { fetchData, fetchItem, IQueryParam, getQuery } from './base';
import { Transaction } from 'src/types/Transaction';

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
        params.push({ name: 'or', value: `(from.eq.${addrLower},to.eq.${addrLower})` });
    }
};

const append24zeros = (address: string) => {
     return '0x' + Array(24+1).join('0') + address.substring(2);
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
            params.push({ name: 'blockNumber', value: `eq.${filter.block}` });
        }
    } else {
        if (filter.address !== undefined) {
            params.push({ name: 'address', value: append24zeros(filter.address) });
        }
    }
    return params;
};

const addOrder = (params: IQueryParam[], filter: ITransactionsFilter) => {
    if (filter.show === 'transactions') {
        params.push({ name: 'order', value: 'nonce.desc' });
    } else {
        params.push({ name: 'order', value: 'timestamp.desc' });
    }
    return params;
};

const addPaging = (params: IQueryParam[], filter: ITransactionsFilter, page: number, pageSize: number) => {
    if (filter.show === 'transactions') {
        params.push({ name: 'offset', value: pageSize * (page-1) });
        params.push({ name: 'limit', value: pageSize });
    } else {
        params.push({ name: 'skip', value: pageSize * (page-1) });
        params.push({ name: 'size', value: pageSize });
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
    const filter: ITransactionsFilter = { show, address, block };
    const tpl = getEndpoint(filter);
    const params = getParams(filter);
    addOrder(params, filter);
    addPaging(params, filter, page, pageSize);
    const query = getQuery(tpl, params);
    const data = await fetchData(query);
    return typeof(data) === 'object' ? data.map((row: any) => new Transaction(row)) : data;
};

export const transactionsCount = async (show: TTransactionsShow, address?: string, block?: number) => {
    const filter: ITransactionsFilter = { show, address, block };

    if (show === 'transactions') {
        const params = getParams(filter);
        params.push({ name: 'select', value: 'count' });
        const query = getQuery('transactions?', params);
        return fetchData(query);
    } else {
        const params = getParams(filter);
        const query = getQuery('rpc/token_transfers_count?', params);
        return fetchData(query);
    }
};

export const transaction = async (hash: string) => {
    const data = await fetchItem(`transactions?hash=eq.${hash}&limit=1`);
    return new Transaction(data);
};
