import { BN } from 'bn.js';
import { BalanceUtils } from '../utils/balance-utils';
import { SonmApi } from "sonm-api/dist";

// Init
const sonmApi = SonmApi.create('livenet', true);
const sonmApiPromise = sonmApi.init();
let ratePromise: Promise<string>;
let rate: string;
sonmApiPromise.then((res: any) => {
    sonmApi.initContracts(['token', 'oracleUSD']);
    ratePromise = sonmApi.wrappers.oracleUSD.getCurrentPrice();
    ratePromise.then((res: string) => {
        rate = res;
    });
});
// End init.

const WEI_PRECISION = Array(19).join('0');

const toUsd = (value: string, rate: string) => {
    return parseInt(rate, 10) > 0
        ? new BN(value + WEI_PRECISION).div(new BN(rate)).toString()
        : '0';
};

export const getBalance = async (address: string): Promise<[string, string]> => {
    await sonmApiPromise;
    await ratePromise;
    const snm = await sonmApi.wrappers.token.balanceOf(address.toLowerCase());
    const usd = toUsd(snm, rate);
    const formated: [string, string] = [
        BalanceUtils.formatBalance(snm),
        BalanceUtils.formatBalance(usd, 2)
    ];
    return formated;
};
