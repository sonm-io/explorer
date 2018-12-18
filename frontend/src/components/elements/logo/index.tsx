import * as React from 'react';
import * as cn from 'classnames';
import './logo.less';

interface ILogoProps {
    className?: string;
}

export const Logo = (props: ILogoProps) =>
    <div className={cn('logo', props.className)}>
        <div className="logo__title">
            SONM BE
        </div>
        <div className="logo__subtitle">
            blockchain explorer
        </div>
    </div>;
