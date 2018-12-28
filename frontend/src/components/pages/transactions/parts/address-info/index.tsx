import * as React from 'react';
import './address-info.less';
import { Address } from 'src/components/elements/address';

interface IAddressInfoProps {
    address: string;
    transactionsCount: number;
    balanceSnm: string;
    balanceUsd: string;
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
                <div className="address-info__block">
                    <div className="address-info__label">
                        Balance, SNM
                    </div>
                    <div className="address-info__value">
                        {p.balanceSnm}
                    </div>
                </div>
                <div className="address-info__block">
                    <div className="address-info__label">
                        SNM Value, $
                    </div>
                    <div className="address-info__value">
                        {p.balanceUsd}
                    </div>
                </div>
            </div>
        );
    }
}
