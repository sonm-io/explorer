import { fetchData, fetchItem, IQueryParam, getQuery } from './base';

// ToDo: extract 'show' and 'address' to filter object.

export const transactions = (
    page: number,
    pageSize: number,
    show: string, // transactions | transactions tokens
    address?: string,
    block?: number,
) => {
    const params: IQueryParam[] = [];
    params.push({ name: 'offset', value: pageSize * (page-1) });
    params.push({ name: 'limit', value: pageSize });

    if (address !== undefined) {
        params.push({ name: 'or', value: `(from.eq.${address},to.eq.${address})` });
    }
    if (block !== undefined) {
        params.push({ name: 'blockNumber', value: `eq.${block}` });
    }

    params.push({ name: 'order', value: 'nonce.desc' });

    const query = getQuery('transactions?', params);
    return fetchData(query);
};

export const transactionsCount = (show: string, address?: string) => {
    const params: IQueryParam[] = [];
    params.push({ name: 'select', value: 'count' });
    if (address !== undefined) {
        params.push({ name: 'or', value: `(from.eq.${address},to.eq.${address})` });
    }
    const query = getQuery('transactions?', params);
    return fetchData(query);
};

export const transaction = (hash: string) => fetchItem(`transactions?hash=eq.${hash}&limit=1`);
