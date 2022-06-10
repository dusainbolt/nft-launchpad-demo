import { MetaMaskIcon } from '@asset/icon/metamask';
import { Button } from '@common/Button';
import { ButtonIcon } from '@common/Button/ButtonIcon';
import { Layout } from '@common/Layout';
import { useControlConnect } from '@hooks/useConnectProvider';
import LogoutIcon from '@mui/icons-material/Logout';
import { Alert, Container, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { getWalletSlice } from '@redux/slices/walletSlice';
import { useAppSelector } from '@redux/store';
import { TypeWallet } from '@type/wallet';
import { FC } from 'react';
import { useStyles } from './homePageStyle';

const HomePageComponent: FC<any> = () => {
  const styles = useStyles();
  const wallet = useAppSelector(getWalletSlice);

  return <Layout>12312</Layout>;

  // return !wallet.connected ? (
  //   <main className={styles.main}>
  //     <Container maxWidth="lg">
  //       <Typography variant="h1" className={styles.title} component="h1" gutterBottom>
  //         Welcome NFT Launchpad
  //       </Typography>
  //       <Alert className={styles.spacingContent} severity="info">
  //         Please connect Metamask wallet to using service
  //       </Alert>
  //       <Stack className={styles.spacingContent} direction="row" spacing={2}>
  //         <Button
  //           onClick={() => connectWallet(TypeWallet.METAMASK)}
  //           className={styles.btnMetamask}
  //           variant="outlined"
  //           startIcon={<MetaMaskIcon />}
  //         >
  //           Metamask
  //         </Button>
  //       </Stack>
  //       {/*
  //       {!wallet.connected ? (
  //         <>

  //         </>
  //       ) : (
  //         <>
  //           <Typography className={styles.spacingContent} variant="subtitle1" gutterBottom component="div">
  //             Your wallet address:
  //           </Typography>
  //           <Stack direction="row" spacing={2}>
  //             <Button className={styles.btnMetamask} startIcon={<MetaMaskIcon />}>
  //               {wallet.address}
  //             </Button>
  //             <ButtonIcon onClick={onDisconnect} icon={<LogoutIcon />} />
  //           </Stack>
  //         </>
  //       )} */}
  //     </Container>
  //   </main>
  // ) : (
  // );
};

export default HomePageComponent;
