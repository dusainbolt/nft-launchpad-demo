import { EthIcon } from '@asset/icon/EthIcon';
import { MetaMaskIcon } from '@asset/icon/metamask';
import { TokenIcon } from '@asset/icon/TokenIcon';
import { Button } from '@common/Button';
import { ButtonIcon } from '@common/Button/ButtonIcon';
import { useControlConnect } from '@hooks/useConnectProvider';
import useGetBalance from '@hooks/useGetBalanace';
import LogoutIcon from '@mui/icons-material/Logout';
import { Divider, Stack } from '@mui/material';
import { getWalletSlice } from '@redux/slices/walletSlice';
import { useAppSelector } from '@redux/store';
import { ContractService } from '@services/contract';
import Helper from '@services/helper';
import { TypeWallet } from '@type/wallet';
import { useWeb3React } from '@web3-react/core';
import clsx from 'clsx';
import { FC, useCallback, useState } from 'react';
import { layoutStyle } from './layoutStyle';

interface SidebarProps {
  activeLink?: string;
}

export const Sidebar: FC<SidebarProps> = () => {
  const styles = layoutStyle();
  const { connectWallet, onDisconnect } = useControlConnect();
  const wallet = useAppSelector(getWalletSlice);
  const { balance, balanceToken } = useGetBalance();
  const { account, library } = useWeb3React();
  const [loadingTransaction, setLoadingTransaction] = useState<boolean>(false);

  const handleFaucet = useCallback(async () => {
    setLoadingTransaction(true);
    try {
      const contractService = new ContractService(library, account as any);
      await contractService.faucetToken();
      // typeof window === 'undefined' && (window as any)?.location?.reload(true);
      document?.location?.reload();
    } catch (e) {
      console.log('error: ', e);
    }
    setLoadingTransaction(false);
  }, [account, library]);

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarWrap}>
        {wallet.connected ? (
          <Stack spacing={2} sx={{ marginTop: 1 }}>
            <div className={styles.walletAddress}>
              <MetaMaskIcon /> <span>{Helper.splitString(wallet.address)}</span>
            </div>
            <div className={clsx(styles.walletAddress)}>
              <EthIcon /> <span style={{ fontWeight: 700 }}> {balance}</span>
              <span style={{ fontSize: 11, marginLeft: 5, display: 'block' }}>ETH</span>
            </div>
            <div className={clsx(styles.walletAddress)}>
              <TokenIcon size={30} /> <span style={{ fontWeight: 700, marginLeft: 3 }}> {balanceToken}</span>
              <span style={{ fontSize: 11, marginLeft: 5, display: 'block' }}>LHD</span>
            </div>
            <Divider />
            <p>Click button bellow to receive 100 LHD for testing</p>
            <Button
              loading={loadingTransaction}
              onClick={handleFaucet}
              className={styles.btnMetamask}
              variant="outlined"
            >
              Free (100 LHD)
            </Button>
            <Divider />
            <ButtonIcon sx={{ width: 'max-content' }} onClick={onDisconnect} icon={<LogoutIcon />} />
          </Stack>
        ) : (
          <Button
            onClick={() => connectWallet(TypeWallet.METAMASK)}
            className={styles.btnMetamask}
            variant="outlined"
            startIcon={<MetaMaskIcon />}
          >
            Metamask
          </Button>
        )}
      </div>
    </div>
  );
};
