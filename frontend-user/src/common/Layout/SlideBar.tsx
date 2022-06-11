import { EthIcon } from '@asset/icon/EthIcon';
import { MetaMaskIcon } from '@asset/icon/metamask';
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
  // const { role } = useAppSelector(getAuthSlice);
  const { connectWallet, onDisconnect } = useControlConnect();
  const wallet = useAppSelector(getWalletSlice);
  const { balance } = useGetBalance();

  // const menu = {
  //   [Role.USER]: [
  //     { text: 'Profile', icon: <InboxIcon />, href: '/user', hideByProject: true },
  //     { text: 'Edit Profile', icon: <InboxIcon />, href: '/user/edit', hideByProject: true },
  //     { text: 'History', icon: <InboxIcon />, href: '/user/history', hideByProject: true },
  //     { text: 'Share History', icon: <InboxIcon />, href: '/user/shared', hideByProject: true },
  //     // Project route together user route
  //     { text: 'Dashboard', icon: <InboxIcon />, href: '/user/project' },
  //   ],
  //   [Role.ADMIN]: [
  //     { text: 'My Account', icon: <InboxIcon />, href: '/admin' },
  //     { text: 'KYC', icon: <InboxIcon />, href: '/admin/kyc' },
  //   ],
  // };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarWrap}>
        {wallet.connected ? (
          <Stack spacing={2} sx={{ marginTop: 1 }}>
            <div className={styles.walletAddress}>
              <MetaMaskIcon /> <span>{Helper.splitString(wallet.address)}</span>
            </div>
            <div className={clsx(styles.walletAddress)}>
              <EthIcon /> <span> {balance}</span>
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
