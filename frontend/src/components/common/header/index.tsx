import * as React from 'react';
import './header.less';
import { prefix } from 'src/utils/common';

interface IHeaderProps {
    title: string;
    subtitle?: string;
}

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
