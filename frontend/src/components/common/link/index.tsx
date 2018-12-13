import * as React from 'react';
import { Link as LinkSrc, LinkProps } from 'react-router-dom';
import * as cn from 'classnames';
import './link.less';

export class Link extends React.Component<LinkProps, never> {
    public render() {
        const { className, ...p } = this.props;
        return (<LinkSrc className={cn('link', className)} {...p} />);
    }
}

export default Link;
