import {BalanceData, TokenData} from "@ensofinance/sdk";

export type Position = {
    balance: BalanceData;
    token: TokenData;
};
