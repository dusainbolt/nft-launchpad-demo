import { injected } from '@connectors/walletConnector';
import { ReceiveWallet } from '@redux/action/walletAction';
import { getWalletSlice, receiveWallet } from '@redux/slices/walletSlice';
import { useAppDispatch, useAppSelector } from '@redux/store';
import Constant from '@services/constant';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { useControlConnect } from './useConnectProvider';

export function useEagerConnect() {
  const { activate, account, chainId, active } = useWeb3React();
  const [tried, setTried] = useState(false);
  const { address } = useAppSelector(getWalletSlice);
  const dispatch = useAppDispatch();
  const { onDisconnect } = useControlConnect();

  useEffect(() => {
    address &&
      injected.isAuthorized().then((isAuthorized: boolean) => {
        if (isAuthorized) {
          activate(injected, undefined, true).catch(() => {
            setTried(true);
          });
        } else {
          setTried(true);
          // resetAuthAndWallet();
        }
      });
  }, [address]); // intentionally only running on mount (make sure it's only mounted once :))

  useEffect(() => {
    if (account && chainId) {
      dispatch(receiveWallet({ account, chainId } as ReceiveWallet));
    }
  }, [account, chainId]);

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  useEffect(() => {
    if (tried && !account) {
      onDisconnect();
    }
  }, [tried, account]);

  return tried;
}

export function useInactiveListener(suppress: boolean = false) {
  const { active, error, activate } = useWeb3React();

  useEffect((): any => {
    const { ethereum } = window as any;
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log("Handling 'connect' event");
        activate(injected);
      };
      const handleChainChanged = (chainId: string | number) => {
        console.log("Handling 'chainChanged' event with payload", chainId);
        activate(injected);
      };

      const handleAccountsChanged = (accounts: string[]) => {
        console.log("Handling 'accountsChanged' event with payload ", accounts);
        if (accounts.length > 0) {
          activate(injected);
        }
      };
      const handleNetworkChanged = (networkId: string | number) => {
        console.log("Handling 'networkChanged' event with payload", networkId);
        activate(injected);
      };

      ethereum.on('connect', handleConnect);
      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('networkChanged', handleNetworkChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect);
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('networkChanged', handleNetworkChanged);
        }
      };
    }
  }, [active, error, suppress, activate]);

  useEffect(() => {
    const switchNetwork = async () => {
      try {
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${Number(Constant.ENV.ETH_CHAIN_ID).toString(16)}` }],
        });
      } catch (switchError: any) {
        console.log('switchError', switchError);
      }
    };
    // const addToken = async () => {
    //   try {
    //     // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    //     await (window as any).ethereum.request({
    //       method: 'wallet_watchAsset',
    //       params: {
    //         type: 'ERC20', // Initially only supports ERC20, but eventually more!
    //         options: {
    //           address: process.env.NEXT_PUBLIC_TOKEN_CONTRACT, // The address that the token is at.
    //           symbol: 'LHD', // A ticker symbol or shorthand, up to 5 chars.
    //           decimals: 18, // The number of decimals in the token
    //           // image: tokenImage, // A string url of the token logo
    //         },
    //       },
    //     });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    switchNetwork();
    // addToken();
  }, []);
}
