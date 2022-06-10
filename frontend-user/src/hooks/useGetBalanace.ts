import { getWalletSlice } from '@redux/slices/walletSlice';
import { useAppSelector } from '@redux/store';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { BigNumber as BN } from 'ethers';

const useGetBalance = () => {
  const [balance, setBalance] = useState<any>('');
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
      return parseFloat(web3.utils.fromWei(balance)).toFixed(5);
    }

    return 0;
  };

  const getBalanceState = async () => {
    const balanceETH = await getETHBalance(wallet.address);
    setBalance(balanceETH);
  };

  useEffect(() => {
    getBalanceState();
  }, []);

  return {
    balance,
  };
};

export default useGetBalance;
