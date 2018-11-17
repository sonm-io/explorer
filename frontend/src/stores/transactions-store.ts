import * as PagedList from "./paged-list";
import { PagedListActions, IListState, TFetchPage } from "./paged-list";
import { Transaction } from "src/types/Transaction";
import { Store } from "unistore";
import { IController } from './common';

export interface ITransactionsState extends IListState<Transaction> {
    address?: string;
}

interface ITransactionsBoundActs {
    changeAddress: (address?: string) => void;
    fetch: (page?: number) => void;
}

export class TransactionsActions extends PagedListActions<Transaction, ITransactionsState> {
    constructor(
        allTransactions: TFetchPage<Transaction>,
        transactionsByAddress: (address: string) => TFetchPage<Transaction>,
        store: Store<ITransactionsState>
    ) {
        super(allTransactions, store);
        this.allTransactions = allTransactions;
        this.transactionsByAddress = transactionsByAddress;
    }

    private allTransactions: TFetchPage<Transaction>;
    private transactionsByAddress: (address: string) => TFetchPage<Transaction>;

    public changeAddress = async (state: ITransactionsState, address?: string) => {
        if (address === undefined) {
            this.fetchMethod = this.allTransactions;
        } else {
            this.fetchMethod = this.transactionsByAddress(address);
        }
        this.store.setState({ address });
        return this.fetch(state, 1);
    }
}

const initStore: (pageSize?: number) => Store<ITransactionsState> = PagedList.initStore;

const initActions = (
    all: TFetchPage<Transaction>,
    byAddress: (address: string) => TFetchPage<Transaction>
) =>
    (store: Store<ITransactionsState>) =>
        new TransactionsActions(all, byAddress, store);

const getBoundedActions = (
        store: Store<ITransactionsState>,
        actions: (store: Store<ITransactionsState>) => TransactionsActions
    ): ITransactionsBoundActs => ({
    changeAddress: store.action(actions(store).changeAddress),
    fetch: store.action(actions(store).fetch),
});

export type ITransactionsCtl = IController<ITransactionsState, TransactionsActions, ITransactionsBoundActs>;

export const init = (
    allTransactions: TFetchPage<Transaction>,
    transactionsByAddress: (address: string) => TFetchPage<Transaction>,
    pageSize?: number
): ITransactionsCtl => {
    const store = initStore(pageSize);
    const actions = initActions(allTransactions, transactionsByAddress);

    return {
        store,
        actions,
        boundedActions: getBoundedActions(store, actions),
    };
};
