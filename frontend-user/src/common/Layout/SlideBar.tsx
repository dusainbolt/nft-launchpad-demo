import { EthIcon } from '@asset/icon/EthIcon';
import { MetaMaskIcon } from '@asset/icon/metamask';
import { TokenIcon } from '@asset/icon/TokenIcon';
import { Button } from '@common/Button';
import { ButtonIcon } from '@common/Button/ButtonIcon';
import { useControlConnect } from '@hooks/useConnectProvider';
import useGetBalance from '@hooks/useGetBalanace';
import LogoutIcon from '@mui/icons-material/Logout';
import { Stack } from '@mui/material';
import { getWalletSlice } from '@redux/slices/walletSlice';
import { useAppSelector } from '@redux/store';
import Helper from '@services/helper';
import { TypeWallet } from '@type/wallet';
import clsx from 'clsx';
import { FC } from 'react';
import { layoutStyle } from './layoutStyle';

interface SidebarProps {
  activeLink?: string;
}

export const Sidebar: FC<SidebarProps> = () => {
  const styles = layoutStyle();
  const { connectWallet, onDisconnect } = useControlConnect();
  const wallet = useAppSelector(getWalletSlice);
  const { balance, balanceToken } = useGetBalance();

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
