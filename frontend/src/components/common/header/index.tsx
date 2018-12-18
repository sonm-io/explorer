import * as React from 'react';
import './header.less';
import { prefix } from 'src/utils/common';
import * as cn from 'classnames';

interface IHeaderProps {
    title: string;
    subtitle?: string;
    className?: string;
}

const css = prefix('header__');

export const Header = (props: IHeaderProps) => (
    <div className={cn('header', props.className)}>
        <h1 className={css('title')}>{props.title}</h1>
        {props.subtitle !== undefined
            ? <span className={css('subtitle')}>{props.subtitle}</span>
            : null
        }
    </div>
);

export default Header;
