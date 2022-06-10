import { AppDialog } from '@common/Dialog';
import { useConnectProvider } from '@hooks/useConnectProvider';
import LogoDevIcon from '@mui/icons-material/LogoDev';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Breadcrumbs, Button, IconButton, InputBase, Link, Menu, MenuItem, Typography } from '@mui/material';
import { BreadcrumbsType } from '@type/layout';
import { FC, ReactNode, useState } from 'react';
import { layoutStyle } from './layoutStyle';
import { Sidebar } from './SlideBar';

interface LayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbsType[];
}

export const Layout: FC<LayoutProps> = ({ children, breadcrumbs }) => {
  useConnectProvider();
  // useRedirectAuth();
  const styles = layoutStyle();
  // const { address } = useAppSelector(getWalletSlice);
  // const { token } = useAppSelector(getAuthSlice);
  // const [anchorEl, setAnchorEl] = useState(null);
  // const { deactivate } = useWeb3React();
  // const { loadingProfile } = useAppSelector(getProfileSlice);

  // const handleMenu = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  // const handleLogout = () => {
  //   handleClose();
  //   deactivate();
  // };

  // const showContentAuth = token && address;

  // const backDropLayout = (
  //   <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open onClick={handleClose}>
  //     <CircularProgress color="inherit" />
  //   </Backdrop>
  // );
  const pages = ['Marketplace', 'MyNFT', 'Staking'];
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  return (
    <>
      <div className={styles.header}>
        <div className={styles.logoWrap}>
          <LogoDevIcon />
          <div>NFT Launchpad</div>
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
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button key={page} sx={{ my: 2, color: 'black', marginRight: 2, display: 'block' }}>
                {page}
              </Button>
            ))}
          </Box>
        </div>
        {/* <div onClick={handleMenu} className={styles.walletWrap}>
          <div className={styles.walletAddress}>
            <AccountCircleIcon /> <span>{Helper.splitString(address)}</span>
          </div>
        </div> */}
        {/* <MenuCustom id="account-wallet-menu" open={Boolean(anchorEl)} handleClose={handleClose} anchorEl={anchorEl}>
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </MenuCustom> */}
      </div>
      <div className={styles.body}>
        <Sidebar />
        {/* {!loadingProfile ? <div className={styles.bodyContent}>{children}</div> : backDropLayout} */}
      </div>
      <AppDialog />
    </>
  );
};
