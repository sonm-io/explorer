import * as React from 'react';
import IdentIcon from 'src/components/common/ident-icon';
import Hash from 'src/components/common/hash';
import './address.less';

interface IAddressProps {
    hash: string;
}

export class Address extends React.Component<IAddressProps, never> {
    public render() {
        const p = this.props;
        return (
            <div className="address">
                <IdentIcon address={p.hash} />
                <Hash className="address__hash" hash={p.hash} hasCopyButton />
            </div>
        );
    }
}

export default Address;
