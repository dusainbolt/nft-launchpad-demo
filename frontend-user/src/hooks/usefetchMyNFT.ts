import { searchNftAPI } from '@request/nftRequest';
import { NFTStatus } from '@type/nft';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';

const useFetchMyNFT = () => {
  const { account } = useWeb3React();
  const [loadingFetchNFT, setLoadingFetchNFT] = useState<boolean>(false);
  const [createItems, setCreateItems] = useState<any[]>([]);
  const [boughtItems, setBoughtItems] = useState<any[]>([]);

  const onFetchMyNFT = async () => {
    setLoadingFetchNFT(true);
    try {
      const { data: myNFTs } = await searchNftAPI({ owner: account });
      setCreateItems(myNFTs.filter((item) => item.status === NFTStatus.CREATE));
      setBoughtItems(myNFTs.filter((item) => item.status === NFTStatus.BOUGHT));
    } catch (error: any) {
      console.log('error: ', error);
      NotificationManager.warning(error.message, 'Warning');
    }
    setLoadingFetchNFT(false);
  };

  useEffect(() => {
    console.log('account:', account);
    if (account) {
      onFetchMyNFT();
    }
  }, [account]);

  return {
    loadingFetchNFT,
    onFetchMyNFT,
    createItems,
    boughtItems,
  };
};

export default useFetchMyNFT;
