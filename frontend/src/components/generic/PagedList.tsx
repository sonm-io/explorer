import * as React from 'react';
import { IListProps } from 'src/components/factories/list';

export class PagedList<TItem, TProps extends IListProps<TItem>> extends React.Component<TProps> {
    protected handleChangePage = (event: any, page: number) => {
        this.props.update({ page });
    }

    protected handleChangePageSize = (event: any) => {
        this.props.update({ pageSize: event.target.value });
    }
}
