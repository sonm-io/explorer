import { EndpointAddr } from 'src/config';

interface IPageParams {
    offset: number;
    limit: number;
}

const list = (queryFactory: (pageParams: IPageParams) => string) =>
    async (page: number, pageSize: number) => {
        const offset = pageSize * page;
        const limit = pageSize;
        const query = queryFactory({ offset, limit });
        const url = `${EndpointAddr}/${query}`;
        console.log(url);
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

export const blocks = list(({offset, limit}) =>
    `blocks?order=number.desc&limit=${limit}&offset=${offset}`);

export const transactions = list(({offset, limit}) =>
    `/transactions?order=blockNumber.desc&limit=${limit}&offset=${offset}`);
