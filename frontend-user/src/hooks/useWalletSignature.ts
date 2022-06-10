import { useState, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { NotificationManager } from 'react-notifications';
import { BigNumber as BN } from 'ethers';
import { WalletSignature } from '@type/wallet';
import Hash from '@services/hash';

const useWalletSignature = () => {
  const { library, connector } = useWeb3React();
  const [loadingSignature, setLoadingSignature] = useState<boolean>(false);
  const [walletSignature, setWalletSignature] = useState<WalletSignature>({
    messageHash: '',
    signature: '',
  });

  const signMessage = useCallback(
    async (address) => {
      try {
        if (address && library) {
          setLoadingSignature(true);
          const msgObj = {
            originalMessage: process.env.NEXT_PUBLIC_MESSAGE_SIGNATURE,
            dateTime: BN.from(Date.now()).div(1000).toString(),
          };

          const messageHash = Hash.encryptAES(msgObj);

          const signature = await library.getSigner(address).signMessage(messageHash);
          setWalletSignature({ signature, messageHash });
          setLoadingSignature(false);
        }
      } catch (err: any) {
        console.log('[ERROR] - signMessage:', err);
        setLoadingSignature(false);
        NotificationManager.warning(err?.message, 'Warning');
      }
    },
    [library, connector]
  );

  return {
    signMessage,
    walletSignature,
    setWalletSignature,
    loadingSignature,
  };
};

export default useWalletSignature;
