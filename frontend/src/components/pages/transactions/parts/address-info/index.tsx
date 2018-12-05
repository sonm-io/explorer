import * as React from 'react';
import './address-info.less';
import { Address } from 'src/components/elements/address';

interface IAddressInfoProps {
    address: string;
    transactionsCount: number;
}

export class AddressInfo extends React.Component<IAddressInfoProps, never> {
    public render() {
        const p = this.props;
        return (
            <div className="address-info">
                <Address hash={p.address} />
                <div className="address-info__block">
                    <div className="address-info__label">
                        Transactions
                    </div>
                    <div className="address-info__value">
                        {p.transactionsCount}
                    </div>
                </div>
            </div>
        );
    }
}
