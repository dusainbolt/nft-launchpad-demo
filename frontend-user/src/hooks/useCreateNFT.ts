import { createNftAPI } from '@request/nftRequest';
import Helper from '@services/helper';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useState } from 'react';
import { NotificationManager } from 'react-notifications';

const useCreateNFT = (onFetchMyNFT, toggleModalCreateNFT) => {
  const { library, account } = useWeb3React();
  const [loadingForm, setLoadingForm] = useState<boolean>(false);

  const onSubmitCreateNFT = useCallback(
    async ({ name, description, image, price }) => {
      setLoadingForm(true);
      try {
        const nftIpfsData: any = {
          name,
          description,
          image,
          attributes: [],
        };
        const added = await Helper.ipfs.add(JSON.stringify(nftIpfsData));
        const ipfsURI = Helper.ipfsPath(added);

        const signatureObj = {
          ...nftIpfsData,
          ipfsURI,
          price: price?.toString(),
        };

        const signature = await library.getSigner(account).signMessage(JSON.stringify(signatureObj));

        const nftData = {
          ...signatureObj,
          ipfsURI,
          owner: account,
          signature,
        };

        const { data: nft } = await createNftAPI(nftData);
        if (nft) {
          toggleModalCreateNFT();
          onFetchMyNFT();
        }
      } catch (error: any) {
        console.log('error', error);
        NotificationManager.warning(error?.message, 'Warning');
      }
      setLoadingForm(false);
    },
    [library, account]
  );
  return {
    loadingForm,
    onSubmitCreateNFT,
  };
};

export default useCreateNFT;
