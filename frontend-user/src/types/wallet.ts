export enum TypeWallet {
  METAMASK,
  WALLET_CONNECT,
}

export type WalletSlice = {
  type: TypeWallet | null;
  address: string;
  chainId: number | string;
  balance: any;
  connected: boolean;
  processing: boolean;
};

export type WalletSignature = {
  messageHash: string;
  signature: string;
};
