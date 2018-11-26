import * as React from 'react';
import * as cn from 'classnames';
import { Spinner } from '../spinner';
import './index.css';

export interface ILoadMaskProps extends React.ButtonHTMLAttributes<any> {
    className?: string;
    visible?: boolean;
    children: any;
    white?: boolean;
    region?: boolean;
}

export class LoadMask extends React.PureComponent<ILoadMaskProps, never> {
    public processRootRef = (ref: HTMLElement | null) => {
        if (ref !== null) {
            if (
                this.props.region &&
                (ref.parentElement === null ||
                    window.getComputedStyle(ref.parentElement).position ===
                        'static')
            ) {
                throw new Error(
                    'Load mask parent element position should be relative or absolute'
                );
            }
        }
    }

    public render() {
        const { className, children, white, region, visible } = this.props;

        return [
            <div
                key="loadmask"
                ref={this.processRootRef}
                className={cn(className, 'load-mask', {
                    'load-mask--region': region,
                    'load-mask--hidden': !visible,
                    'load-mask--top': !region,
                })}
            >
                <div
                    className={cn('load-mask__pale', {
                        'load-mask__pale--white': white,
                    })}
                >
                    <Spinner
                        className={cn(
                            'load-mask__spinner',
                            region
                                ? 'load-mask__spinner--region-center'
                                : 'load-mask__spinner--screen-center'
                        )}
                    />
                </div>
            </div>,
            children,
        ];
    }
}

export default LoadMask;
