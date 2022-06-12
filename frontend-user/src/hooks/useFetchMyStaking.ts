import { getWalletSlice } from '@redux/slices/walletSlice';
import { useAppSelector } from '@redux/store';
import { searchNftAPI } from '@request/nftRequest';
import { ContractService } from '@services/contract';
import { NFTStatus } from '@type/nft';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { BigNumber as BN } from 'ethers';

const useFetchStaking = () => {
  const [loadingFetchNFT, setLoadingFetchNFT] = useState<boolean>(false);
  const [stakingInfo, setStakingInfo] = useState<any>({});
  const [listNFT, setListNFT] = useState<any[]>([]);
  const { account, library } = useWeb3React();
  const wallet = useAppSelector(getWalletSlice);

  const onFetchMyStaking = async () => {
    setLoadingFetchNFT(true);
    try {
      const { data } = await searchNftAPI({ status: NFTStatus.STAKED, owner: account });
      setListNFT(data);
    } catch (error: any) {
      console.log('error: ', error);
      NotificationManager.warning(error.message, 'Warning');
    }
    setLoadingFetchNFT(false);
  };

  useEffect(() => {
    if (account) {
      onFetchMyStaking();
    }
  }, [account]);

  const getStakingInfo = async () => {
    try {
      const stakingContract = new ContractService(library, account as any).getContractStaking();
      const balance = (await stakingContract.balanceOf(wallet.address)) as BN;
      const totalSupply = (await stakingContract.totalSupply()) as BN;
      const earn = (await stakingContract.earned(wallet.address)) as BN;
      const rewardPerToken = (await stakingContract.rewardPerToken()) as BN;
      setStakingInfo({
        balance: balance.div(BN.from(10).pow(18 as number)),
        totalSupply: totalSupply.div(BN.from(10).pow(18 as number)),
        earn: earn.div(BN.from(10).pow(18 as number)),
        rewardPerToken: rewardPerToken.div(BN.from(10).pow(18 as number)),
      });
    } catch (err) {
      console.log('e: ', err);
    }
  };

  useEffect(() => {
    if (wallet.address && account && library) {
      getStakingInfo();
    }
  }, [wallet.address, account, library]);

  return {
    loadingFetchNFT,
    onFetchMyStaking,
    getStakingInfo,
    listNFT,
    stakingInfo,
  };
};

export default useFetchStaking;
