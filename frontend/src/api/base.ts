import { EndpointAddr } from 'src/config';

export interface IPageParams {
    offset: number;
    limit: number;
}

export const fetchData = async (query: string) => {
    const url = `${EndpointAddr}/${query}`;
    //console.log(url);
    // await new Promise((resolve) => {
    //     setTimeout(resolve, 500);
    // }); // for testing purposes
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

export const fetchItem = async (query: string) => fetchData(query).then((r) => r[0]);

export const list = (queryFactory: (pageParams: IPageParams) => string) =>
    async (page: number, pageSize: number) => {
        const offset = pageSize * page;
        const limit = pageSize;
        const query = queryFactory({ offset, limit });
        return fetchData(query);
    };

export interface IQueryParam {
    name: string;
    value: number | string;
}

export const getQuery = (tpl: string, params: IQueryParam[]) => {
    return params.length === 0
        ? tpl
        : tpl + '&' + params.map((p) => `${p.name}=${p.value}`).join('&');
};
