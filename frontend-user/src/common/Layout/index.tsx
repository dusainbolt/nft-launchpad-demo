import { AppDialog } from '@common/Dialog';
import { useConnectProvider } from '@hooks/useConnectProvider';
import LogoDevIcon from '@mui/icons-material/LogoDev';
import { Box, Breadcrumbs, Button, Link, Typography } from '@mui/material';
import { BreadcrumbsType } from '@type/layout';
import { useRouter } from 'next/dist/client/router';
import { FC, ReactNode } from 'react';
import { layoutStyle } from './layoutStyle';
import { Sidebar } from './SlideBar';

interface LayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbsType[];
}

export const Layout: FC<LayoutProps> = ({ children, breadcrumbs }) => {
  useConnectProvider();
  const styles = layoutStyle();
  const router = useRouter();

  const pages = [
    {
      text: 'Marketplace',
      link: '/',
    },
    {
      text: 'MyNFT',
      link: '/my-nft',
    },
    {
      text: 'Staking',
      link: '/staking',
    },
  ];

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
            {pages.map((page, index) => (
              <Button
                href={page.link}
                key={index}
                sx={{
                  my: 2,
                  color: 'black',
                  marginRight: 2,
                  borderRadius: 12,
                  display: 'block',
                  ...(page.link === router.pathname && {
                    border: 'solid 1px #dc6a00',
                    background: '#dc6a00',
                    color: '#ffffff',
                    pointerEvents: 'none',
                    '&:hover': {
                      background: '#dc6a00',
                    },
                  }),
                }}
              >
                {page.text}
              </Button>
            ))}
          </Box>
        </div>
      </div>
      <div className={styles.body}>
        <Sidebar />
        <div className={styles.bodyContent}>{children}</div>
      </div>
      <AppDialog />
    </>
  );
};
