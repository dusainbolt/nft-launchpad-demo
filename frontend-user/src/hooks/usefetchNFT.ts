import { searchNftAPI } from '@request/nftRequest';
import { NFTStatus } from '@type/nft';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';

const useFetchNFT = () => {
  const [loadingFetchNFT, setLoadingFetchNFT] = useState<boolean>(false);
  const [listNFT, setListNFT] = useState<any[]>([]);

  const onFetchMyNFT = async () => {
    setLoadingFetchNFT(true);
    try {
      const { data } = await searchNftAPI({ status: NFTStatus.CREATE });
      setListNFT(data);
    } catch (error: any) {
      console.log('error: ', error);
      NotificationManager.warning(error.message, 'Warning');
    }
    setLoadingFetchNFT(false);
  };

  useEffect(() => {
    onFetchMyNFT();
  }, []);

  return {
    loadingFetchNFT,
    onFetchMyNFT,
    listNFT,
  };
};

export default useFetchNFT;
