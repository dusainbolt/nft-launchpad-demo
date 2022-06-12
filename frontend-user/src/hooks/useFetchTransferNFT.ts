import { fetchTransferAPI } from '@request/nftRequest';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';

const useFetchTransferNFT = () => {
  const [loadingFetchTransfer, setLoadingFetchTransfer] = useState<boolean>(false);
  const [listTransfer, setListTransfer] = useState<any[]>([]);
  const { account } = useWeb3React();

  const onFetchMyTransfer = async () => {
    setLoadingFetchTransfer(true);
    try {
      const { data } = await fetchTransferAPI(account);
      setListTransfer(data);
    } catch (error: any) {
      console.log('error: ', error);
      NotificationManager.warning(error.message, 'Warning');
    }
    setLoadingFetchTransfer(false);
  };

  useEffect(() => {
    if (account) {
      onFetchMyTransfer();
    }
  }, [account]);

  return {
    loadingFetchTransfer,
    onFetchMyTransfer,
    listTransfer,
  };
};

export default useFetchTransferNFT;
