import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';

export enum EventPayment {
  ACCEPT_PAYMENT,
  PAYMENT_SUCCESS,
  PAYMENT_STATUS_ERROR,
  PAYMENT_REQUEST_REJECT,
  PAYMENT_RECEIVE_HASH,
}

export class ContractService {
  private library: Web3Provider;

  private account: string;

  static errorCode = {
    METAMASK_PENDING: -32002,
    USER_NOT_ENOUGH_PRICE: -32000,
    USER_REJECT_REQUEST: 4001,
    USER_NOT_PERMISSION: 4003,
    UNPREDICTABLE_GAS_LIMIT: 'UNPREDICTABLE_GAS_LIMIT',
  };

  constructor(library: Web3Provider, account: string) {
    this.library = library;
    this.account = account;
  }

  private getSigner = (): JsonRpcSigner => {
    return this.library.getSigner(this.account).connectUnchecked();
  };
}
