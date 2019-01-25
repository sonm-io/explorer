import { fetchData, fetchItem, IQueryParam, getQuery } from './base';
import { Transaction } from 'src/types/Transaction';

export type TTransactionsShow = 'transactions' | 'token-trns';

// ToDo: extract 'show' and 'address' to filter object.

const addAddrParam = (params: IQueryParam[], address?: string) => {
    if (address !== undefined) {
        const addrLower = address.toLowerCase();
        params.push({ name: 'or', value: `(from.eq.${addrLower},to.eq.${addrLower})` });
    }
};

const transactions = (
    filter: {
        show: TTransactionsShow,
        address?: string,
        block?: number,
    },
    addOrder: boolean = false
): [string, IQueryParam[]] => {
    const params: IQueryParam[] = [];
    if (filter.block !== undefined) {
        params.push({ name: 'blockNumber', value: `eq.${filter.block}` });
    }
    addAddrParam(params, filter.address);
    if (filter.show === 'transactions') {
        if (addOrder) {
            params.push({ name: 'order', value: 'nonce.desc' });
        }
        return ['transactions?', params];
    } else {
        if (addOrder) {
            params.push({ name: 'order', value: 'timestamp.desc' });
        }
        return ['token_transfers?', params];
    }
};

export const transactionsPage = async (
    page: number,
    pageSize: number,
    show: TTransactionsShow,
    address?: string,
    block?: number,
) => {
    const [tpl, params] = transactions({show, address, block}, true);

    params.push({ name: 'offset', value: pageSize * (page-1) });
    params.push({ name: 'limit', value: pageSize });

    const query = getQuery(tpl, params);
    const data = await fetchData(query);
    return data.map((row: any) => new Transaction(row));
};

export const transactionsCount = (show: TTransactionsShow, address?: string, block?: number) => {
    const [tpl, params] = transactions({show, address, block}, false);
    params.push({ name: 'select', value: 'count' });
    const query = getQuery(tpl, params);
    return fetchData(query);
};

export const transaction = (hash: string) => fetchItem(`transactions?hash=eq.${hash}&limit=1`);
