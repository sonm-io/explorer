export interface IListState<TItem> {
    list: TItem[];
    error?: string;
    loading: boolean;
    pageSize: number;
    page: number;
}

export interface IListActions {
    changePageSize: (pageSize: number) => Promise<void>;
    fetch: (page?: number) => Promise<void>;
}

export interface IList<TItem> extends IListState<TItem>, IListActions {}
