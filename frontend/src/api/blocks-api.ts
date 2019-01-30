import { Block } from 'src/types/Block';
import { list, fetchItem, IPageParams, IQueryParam, getQuery } from './base';
import { IBlocksFetchArgs } from 'src/stores/blocks-store';

export const blocks = async ({page, pageSize, filter}: IBlocksFetchArgs) => {
    const queryFactory = ({offset, limit}: IPageParams) => {
        const params: IQueryParam[] = [];
        params.push({ name: 'limit', value: limit });
        params.push({ name: 'offset', value: offset });
        if (filter.date !== undefined) {
            const timestamp = filter.date.getTime() / 1000;
            params.push({ name: 'timestamp', value: `lt.${timestamp}` });
        }
        params.push({ name: 'order', value: 'number.desc' });
        return getQuery('blocks?', params);
    };

    const data = await list(queryFactory)(page, pageSize);
    return typeof(data) === 'object' ? data.map((row: any) => new Block(row)) : data;
};

export const block = async (num: string) => {
    const data = await fetchItem(`blocks?number=eq.${num}&limit=1`);
    return new Block(data);
};
