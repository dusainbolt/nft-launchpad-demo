import { AppDialog } from '@common/Dialog';
import { MenuCustom } from '@common/Menu/MenuCustom';
import { useConnectProvider } from '@hooks/useConnectProvider';
import { useRedirectAuth } from '@hooks/useRedirectAuth';
import { Logout } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoDevIcon from '@mui/icons-material/LogoDev';
import SearchIcon from '@mui/icons-material/Search';
import {
  Backdrop,
  Breadcrumbs,
  CircularProgress,
  Divider,
  IconButton,
  InputBase,
  Link,
  ListItemIcon,
  Typography,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { getAuthSlice } from '@redux/slices/authSlice';
import { getProfileSlice } from '@redux/slices/profileSlice';
import { getWalletSlice } from '@redux/slices/walletSlice';
import { useAppSelector } from '@redux/store';
import Helper from '@services/helper';
import { BreadcrumbsType } from '@type/layout';
import { useWeb3React } from '@web3-react/core';
import { FC, ReactNode, useState } from 'react';
import { layoutStyle } from './layoutStyle';
import { Sidebar } from './SlideBar';

interface LayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbsType[];
}

export const Layout: FC<LayoutProps> = ({ children, breadcrumbs }) => {
  useConnectProvider();
  useRedirectAuth();
  const styles = layoutStyle();
  const { address } = useAppSelector(getWalletSlice);
  const { token } = useAppSelector(getAuthSlice);
  const [anchorEl, setAnchorEl] = useState(null);
  const { deactivate } = useWeb3React();
  const { loadingProfile } = useAppSelector(getProfileSlice);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    deactivate();
  };

  const showContentAuth = token && address;

  const backDropLayout = (
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open onClick={handleClose}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );

  return showContentAuth ? (
    <>
      <div className={styles.header}>
        <div className={styles.logoWrap}>
          <LogoDevIcon />
          <div>KYC Platform</div>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link underline="hover" key="-1" color="inherit" href="/"></Link>
            {breadcrumbs?.map((item, index) =>
              index === breadcrumbs.length - 1 ? (
                <Typography key={index}>{item.text}</Typography>
              ) : (
                <Link underline="hover" key={index} color="inherit" href={item.href}>
                  {item.text}
                </Link>
              )
            )}
          </Breadcrumbs>
        </div>
        <div className={styles.searchWrap}>
          <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search" inputProps={{ 'aria-label': 'search ...' }} />
          <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </div>
        <div onClick={handleMenu} className={styles.walletWrap}>
          <div className={styles.walletAddress}>
            <AccountCircleIcon /> <span>{Helper.splitString(address)}</span>
          </div>
        </div>
        <MenuCustom id="account-wallet-menu" open={Boolean(anchorEl)} handleClose={handleClose} anchorEl={anchorEl}>
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </MenuCustom>
      </div>
      <div className={styles.body}>
        <Sidebar />
        {!loadingProfile ? <div className={styles.bodyContent}>{children}</div> : backDropLayout}
      </div>
      <AppDialog />
    </>
  ) : (
    backDropLayout
  );
};
