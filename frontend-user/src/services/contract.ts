import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { Contract, ethers } from 'ethers';
import { NotificationManager } from 'react-notifications';
import TradeTokenABI from '@asset/contracts/TradeToken';
import Constant from './constant';

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

  private isRevert = (error: any) => error?.toString()?.indexOf('execution reverted: ') !== -1;

  private renderRevertMessage = (error: any) => {
    const errMsg = error?.toString();
    const indexStartOf = errMsg.indexOf('execution reverted: ');
    const startMsg = errMsg.slice(indexStartOf, errMsg.length);
    return startMsg.slice(0, startMsg.indexOf('"'));
  };

  private getSigner = (): JsonRpcSigner => {
    return this.library.getSigner(this.account).connectUnchecked();
  };

  private getProviderOrSigner = (library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner => {
    return account ? this.getSigner() : library;
  };

  private getContract = (address: string, ABI: any): Contract => {
    if (!ethers.utils.isAddress(address)) {
      throw Error(`Invalid 'address' parameter '${address}'.`);
    }
    return new Contract(address, ABI, this.getProviderOrSigner(this.library, this.account) as any);
  };

  public callBuyNFT = async (abiCode: string, callbackTransaction: (event: EventPayment, data: any) => void) => {
    try {
      console.log('abiCode', abiCode);
      const singer = this.getSigner();
      const address = await singer.getAddress();
      const gasPrice = await singer.getGasPrice();
      const nonce = await singer.getTransactionCount();
      const sendResponse = await singer.sendTransaction({
        from: address,
        to: process.env.NEXT_PUBLIC_BUY_NFT_CONTRACT,
        data: abiCode,
        gasPrice,
        nonce,
      });

      const transactionReceipt = await sendResponse.wait(sendResponse.confirmations);
      callbackTransaction(EventPayment.PAYMENT_SUCCESS, transactionReceipt);
    } catch (e: any) {
      if (this.isRevert(e)) {
        NotificationManager.warning(this.renderRevertMessage(e), 'Warning');
      } else {
        console.log('e: ', e);
        NotificationManager.error('Please try again or contact admin', 'Error');
      }
    }
  };

  public approveToken = async () => {
    try {
      const contract = this.getContract(process.env.NEXT_PUBLIC_TOKEN_CONTRACT as any, TradeTokenABI);
      if (contract) {
        const transaction = await contract.approve(process.env.NEXT_PUBLIC_BUY_NFT_CONTRACT, Constant.MAX_INT);
        console.log('Approve Token', transaction);

        await transaction.wait(1);
      }
    } catch (e) {
      console.log('error approve token: ', e);
    }
  };
}
