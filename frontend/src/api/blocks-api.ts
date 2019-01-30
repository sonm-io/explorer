import { Block } from 'src/types/Block';
import { list, fetchItem, IPageParams, IQueryParam, getQuery } from './base';
import { IBlocksFetchArgs } from 'src/stores/blocks-store';

export const blocks = async ({page, pageSize, filter}: IBlocksFetchArgs) => {
    const queryFactory = ({offset, limit}: IPageParams) => {
        const params: IQueryParam[] = [];
        params.push({ name: 'limit', value: limit });
        params.push({ name: 'offset', value: offset });
        if (filter.date !== undefined) {
            const date = filter.date;
            date.setUTCHours(23,59,59,999);
            console.log(date);
            params.push({ name: 'timestamp', value: `lte.${date.toISOString()}` });
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
