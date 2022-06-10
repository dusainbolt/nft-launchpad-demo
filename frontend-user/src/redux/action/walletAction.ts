import { PayloadName } from '@redux/reducer';
import { TypeWallet } from '@type/wallet';

export type ReceiveWallet = {
  account: string;
  chainId: number | string;
};

export type ChooseWalletAction = Record<PayloadName, TypeWallet>;
export type ReceiveWalletAction = Record<PayloadName, ReceiveWallet>;
