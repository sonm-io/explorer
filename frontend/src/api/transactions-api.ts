import { fetchData, fetchItem } from './base';

export const transactions = (
    page: number,
    pageSize: number,
    show: string,
    address?: string,
    block?: number,
) => {
    const offset = pageSize * page;
    const limit = pageSize;
    const query = address !== undefined
        ? `/transactions?select=*&limit=${limit}&offset=${offset}&or=(from.eq.${address},to.eq.${address})&order=nonce.desc`
        : `/transactions?order=blockNumber.desc&limit=${limit}&offset=${offset}`;
    return fetchData(query);
};

export const transaction = (hash: string) => fetchItem(`/transactions?hash=eq.${hash}&limit=1`);
