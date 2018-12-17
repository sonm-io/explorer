import { Block } from 'src/types/Block';
import { list, fetchItem, IPageParams } from './base';

export const blocks = async (page: number, pageSize: number) => {
    const queryFactory = ({offset, limit}: IPageParams) =>
        `blocks?order=number.desc&limit=${limit}&offset=${offset}`;

    const data = await list(queryFactory)(page, pageSize);
    return data.map((row: any) => new Block(row));
};

export const block = async (hash: string) => {
    const data = await fetchItem(`blocks?hash=eq.${hash}&limit=1`);
    return new Block(data);
};
