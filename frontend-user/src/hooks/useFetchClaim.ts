import { fetchClaimAPI } from '@request/nftRequest';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';

const useFetchClaim = () => {
  const [loadingFetchClaim, setLoadingFetchClaim] = useState<boolean>(false);
  const [listClaim, setListClaim] = useState<any[]>([]);
  const { account } = useWeb3React();

  const onFetchMyClaim = async () => {
    setLoadingFetchClaim(true);
    try {
      const { data } = await fetchClaimAPI(account);
      setListClaim(data);
    } catch (error: any) {
      console.log('error: ', error);
      NotificationManager.warning(error.message, 'Warning');
    }
    setLoadingFetchClaim(false);
  };

  useEffect(() => {
    if (account) {
      onFetchMyClaim();
    }
  }, [account]);

  return {
    loadingFetchClaim,
    onFetchMyClaim,
    listClaim,
  };
};

export default useFetchClaim;
