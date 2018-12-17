import { Block } from 'src/types/Block';
import { list, fetchItem } from './base';

export const blocks = list(({offset, limit}) =>
    `blocks?order=number.desc&limit=${limit}&offset=${offset}`);

export const block = async (hash: string) => {
    const data = await fetchItem(`blocks?hash=eq.${hash}&limit=1`);
    return new Block(data);
};
