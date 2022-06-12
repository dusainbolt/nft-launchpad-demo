import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { Contract, ethers } from 'ethers';
import { NotificationManager } from 'react-notifications';
import TradeTokenABI from '@asset/contracts/TradeToken.json';
import BuyNftABI from '@asset/contracts/BuyNFT.json';
import StakingABI from '@asset/contracts/StakingNFT.json';

import Constant from './constant';

export enum EventPayment {
  ACCEPT_PAYMENT,
  PAYMENT_SUCCESS,
  PAYMENT_STATUS_ERROR,
  PAYMENT_REQUEST_REJECT,
  PAYMENT_RECEIVE_HASH,
}

export class ContractService {
  public buyNFTAddress: string = process.env.NEXT_PUBLIC_BUY_NFT_CONTRACT as any;

  public tokenAddress: string = process.env.NEXT_PUBLIC_TOKEN_CONTRACT as string;

  public stakeAddress: string = process.env.NEXT_PUBLIC_STAKING_CONTRACT as string;

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

  public sendTransaction = async (
    abiCode: string,
    to: string,
    callbackTransaction: (event: EventPayment, data: any) => void
  ) => {
    try {
      const singer = this.getSigner();
      const address = await singer.getAddress();
      const gasPrice = await singer.getGasPrice();
      const nonce = await singer.getTransactionCount();
      const sendResponse = await singer.sendTransaction({
        from: address,
        to,
        data: abiCode,
        gasPrice,
        nonce,
      });

      const transactionReceipt = await sendResponse.wait();

      console.log('transactionReceipt: ', transactionReceipt);
      NotificationManager.success('Transaction Success, We are redirecting website', 'Success');

      setTimeout(() => {
        callbackTransaction(EventPayment.PAYMENT_SUCCESS, transactionReceipt);
      }, 1000);
    } catch (e: any) {
      console.log('error: ', e);
      if (this.isRevert(e)) {
        NotificationManager.warning(this.renderRevertMessage(e), 'Warning');
      } else {
        NotificationManager.warning(e?.toString(), 'Warning');
        NotificationManager.warning('Please try again or contact admin', 'Error');
      }
    }
  };

  public getContractToken = () => {
    return this.getContract(this.tokenAddress, TradeTokenABI);
  };

  public getContractNFT = () => {
    return this.getContract(this.buyNFTAddress, BuyNftABI);
  };

  public getContractStaking = () => {
    return this.getContract(this.stakeAddress, StakingABI);
  };

  public approveToken = async () => {
    try {
      const tokenContract = this.getContractToken();
      if (tokenContract) {
        const transaction = await tokenContract.approve(this.buyNFTAddress, Constant.MAX_INT);

        await transaction.wait(1);
        NotificationManager.success('Approve success', 'Success');
      }
    } catch (e: any) {
      console.log('error: ', e);
      NotificationManager.warning(e?.toString(), 'Warning');
      NotificationManager.warning('Please try again or contact admin', 'Error');
    }
  };

  public approveAllStake = async () => {
    try {
      const nftContract = this.getContractNFT();
      if (nftContract) {
        const transaction = await nftContract.setApprovalForAll(this.stakeAddress, true);
        await transaction.wait(1);
        NotificationManager.success('Approval for all success', 'Success');
      }
    } catch (e: any) {
      console.log('error: ', e);
      NotificationManager.warning(e?.toString(), 'Warning');
      NotificationManager.warning('Please try again or contact admin', 'Error');
    }
  };

  public claimReward = async () => {
    try {
      const nftContract = this.getContractStaking();
      if (nftContract) {
        const transaction = await nftContract.claimReward();
        await transaction.wait(1);
        NotificationManager.success('Claim reward success', 'Success');
      }
    } catch (e: any) {
      console.log('error: ', e);
      NotificationManager.warning(e?.toString(), 'Warning');
      NotificationManager.warning('Please try again or contact admin', 'Error');
    }
  };

  public unstake = async (tokenId: number) => {
    try {
      const nftContract = this.getContractStaking();
      if (nftContract) {
        const transaction = await nftContract.unstake(tokenId);
        await transaction.wait(1);
        NotificationManager.success('Unstake success', 'Success');
      }
    } catch (e: any) {
      console.log('error: ', e);
      NotificationManager.warning(e?.toString(), 'Warning');
      NotificationManager.warning('Please try again or contact admin', 'Error');
    }
  };

  public faucetToken = async () => {
    try {
      const tokenContract = this.getContractToken();
      if (tokenContract) {
        const transaction = await tokenContract.faucet();

        await transaction.wait(1);
        NotificationManager.success('Receive 100 LHD success', 'Success');
      }
    } catch (e: any) {
      console.log('error: ', e);
      NotificationManager.warning(e?.toString(), 'Warning');
      NotificationManager.warning('Please try again or contact admin', 'Error');
    }
  };
}
