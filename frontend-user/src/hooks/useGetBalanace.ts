import { getWalletSlice } from '@redux/slices/walletSlice';
import { useAppSelector } from '@redux/store';
import { ContractService } from '@services/contract';
import Helper from '@services/helper';
import { useWeb3React } from '@web3-react/core';
import { BigNumber as BN } from 'ethers';
import { useEffect, useState } from 'react';
import Web3 from 'web3';

const useGetBalance = () => {
  const [balance, setBalance] = useState<any>('');
  const [balanceToken, setBalanceToken] = useState<any>('');
  const { account, library } = useWeb3React();

  const wallet = useAppSelector(getWalletSlice);

  const getWeb3Instance = () => {
    const { ethereum, web3 } = window as any;
    if (ethereum && ethereum.isMetaMask) {
      return new Web3(ethereum);
    }
    if (web3) {
      return new Web3(web3.currentProvider);
    }
    return null;
  };

  const getETHBalance = async (address: string) => {
    const web3 = getWeb3Instance() as any;
    if (web3 && address) {
      const balance = await web3.eth.getBalance(address);
      const balanceConvert = parseFloat(web3.utils.fromWei(balance));
      return balanceConvert < 1 ? balanceConvert.toFixed(5) : balanceConvert.toFixed(3);
    }
    return 0;
  };

  const getBalanceState = async () => {
    try {
      const balanceETH = await getETHBalance(wallet.address);
      setBalance(balanceETH);

      const tokenContract = new ContractService(library, account as any).getContractToken();
      const balance = (await tokenContract.balanceOf(wallet.address)) as BN;
      const decimal = await tokenContract.decimals();

      const balanceReturn = balance.div(BN.from(10).pow(decimal as number));

      setBalanceToken(Helper.getCurrencyVal(balanceReturn));
    } catch (err) {
      console.log('e: ', err);
    }
  };

  useEffect(() => {
    if (wallet.address && account && library) {
      getBalanceState();
    }
  }, [wallet.address, account, library]);

  return {
    balance,
    balanceToken,
  };
};

export default useGetBalance;
