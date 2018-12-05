import { Transaction } from "src/types/Transaction";
import PagedList, { IListState, IListFetchConfig } from "./generic/paged-list";
import Fetch, { IFetchCtl } from "./generic/fetch-store";

// Interfaces

export interface ITransactionsState extends IListState<Transaction> {
    address?: string;
}

export type TTransactionsFetch = (page: number, pageSize: number, address?: string) => Promise<Transaction[] | string>;

interface ITransactionsFetchConfig extends IListFetchConfig<
    Transaction,
    [number, number, string | undefined],
    Transaction[] | string
> {}

// Implementation

export const init = (
    fetchMethod: TTransactionsFetch
): IFetchCtl<ITransactionsState> => {
    const fetchConfig: ITransactionsFetchConfig = {
        fetchMethod,
        getArgs: (state: ITransactionsState) => ([state.page, state.pageSize, state.address]),
        updateStore: PagedList.updateListStore,
    };
    return Fetch.init(PagedList.initState(), fetchConfig);
};

export default {
    init,
};
