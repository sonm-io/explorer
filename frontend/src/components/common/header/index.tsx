import * as React from 'react';
import './header.less';

interface IHeaderProps {
    title: string;
    subtitle?: string;
}

const prefix = (prefix: string) => (value: string) => prefix + value;

const css = prefix('header__');

export const Header = (props: IHeaderProps) => (
    <div className="header">
        <h1 className={css('title')}>{props.title}</h1>
        {props.subtitle !== undefined
            ? <span className={css('subtitle')}>{props.subtitle}</span>
            : null
        }
    </div>
);

export default Header;
