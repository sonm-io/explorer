import { EndpointAddr } from 'src/config';

interface IPageParams {
    offset: number;
    limit: number;
}

const getlist = async (query: string) => {
    const url = `${EndpointAddr}/${query}`;
    console.log(url);
    await new Promise((resolve) => {
        setTimeout(resolve, 500);
    }); // ToDo: for testing purposes
    return await fetch(url)
        .then((res) => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            return res.json();
        })
        .catch((error) => {
            return error.toString();
        });
};

const list = (queryFactory: (pageParams: IPageParams) => string) =>
    async (page: number, pageSize: number) => {
        const offset = pageSize * page;
        const limit = pageSize;
        const query = queryFactory({ offset, limit });
        return getlist(query);
    };

export const blocks = list(({offset, limit}) =>
    `blocks?order=number.desc&limit=${limit}&offset=${offset}`);

export const transactions = (page: number, pageSize: number, address?: string) => {
    const offset = pageSize * page;
    const limit = pageSize;
    const query = address !== undefined
        ? `/transactions?select=*&limit=${limit}&offset=${offset}&or=(from.eq.${address},to.eq.${address})&order=nonce.desc`
        : `/transactions?order=blockNumber.desc&limit=${limit}&offset=${offset}`;
    return getlist(query);
};
