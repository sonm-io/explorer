import { Block } from "src/types/Block";
import PagedList, { IListState } from "./generic/paged-list";
import Fetch, { IFetchCtl, IFetchConfig } from "./generic/fetch-store";

// Interfaces

export interface IBlocksFilter {
    date?: Date;
}

// tslint:disable-next-line:no-empty-interface
export interface IBlocks extends IBlocksFilter {}

export interface IBlocksState extends IBlocks, IListState<Block> {}

export interface IBlocksFetchArgs {
    page: number;
    pageSize: number;
    filter: IBlocksFilter;
}

export type TBlocksFetch = (args: IBlocksFetchArgs) => Promise<Block[] | string>;

interface IBlocksFetchConfig extends IFetchConfig<
    IBlocksState,
    [IBlocksFetchArgs],
    Block[] | string
> {}

// Implementation

const getRoute = (state: IBlocksState) => {
    return '/blocks';
};

export const init = (
    fetchMethod: TBlocksFetch
): IFetchCtl<IBlocksState> => {
    const fetchConfig: IBlocksFetchConfig = {
        fetchMethod,
        getArgs: (state: IBlocksState) => ([{
            page: state.page,
            pageSize: state.pageSize,
            filter: {
                date: state.date
            }
        }]),
        updateStore: PagedList.updateListStore,
        getRoute,
    };
    const state: IBlocksState = {
        ...PagedList.initState(),
    };
    return Fetch.init(state, fetchConfig);
};

export default {
    init,
};
