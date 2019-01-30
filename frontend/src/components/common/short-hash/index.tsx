import * as React from 'react';

interface IShortHash {
    maxLegth?: number;
    value: string;
}

const MAX_LENGTH = 20;

export class ShortHash extends React.Component<IShortHash> {
    public render() {
        const p = this.props;
        const maxLength = p.maxLegth || MAX_LENGTH;
        if (p.value.length > maxLength) {
            const start = p.value.substr(0, maxLength/2);
            const end = p.value.substr(p.value.length - maxLength/2);
            return (
                <React.Fragment>
                    <span>{start}</span>
                    <span>...</span>
                    <span>{end}</span>
                </React.Fragment>
            );
        } else {
            return (<span>{p.value}</span>);
        }
    }
}

export default ShortHash;
