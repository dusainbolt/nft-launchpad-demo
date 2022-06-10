import { Alert, Container, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useStyles } from './homePageStyle';
import Stack from '@mui/material/Stack';
import { MetaMaskIcon } from '@asset/icon/metamask';
import { useControlConnect } from '@hooks/useConnectProvider';
import { TypeWallet } from '@type/wallet';
import { useAppDispatch, useAppSelector } from '@redux/store';
import { getWalletSlice } from '@redux/slices/walletSlice';
import useWalletSignature from '@hooks/useWalletSignature';
import { getAuthSlice, loginStart } from '@redux/slices/authSlice';
import { LoginParams } from '@redux/action/authAction';
import { Role } from '@type/user';
import { Button } from '@common/Button';
import { ButtonIcon } from '@common/Button/ButtonIcon';
import LogoutIcon from '@mui/icons-material/Logout';

const HomePageComponent: FC<any> = () => {
  const styles = useStyles();
  const { connectWallet, onDisconnect } = useControlConnect();
  const wallet = useAppSelector(getWalletSlice);

  return (
    <main className={styles.main}>
      <Container maxWidth="lg">
        <Typography variant="h1" className={styles.title} component="h1" gutterBottom>
          Welcome NFT Launchpad
        </Typography>
        {!wallet.connected ? (
          <>
            <Alert className={styles.spacingContent} severity="info">
              Please connect Metamask wallet to using service
            </Alert>
            <Stack className={styles.spacingContent} direction="row" spacing={2}>
              <Button
                onClick={() => connectWallet(TypeWallet.METAMASK)}
                className={styles.btnMetamask}
                variant="outlined"
                startIcon={<MetaMaskIcon />}
              >
                Metamask
              </Button>
            </Stack>
          </>
        ) : (
          <>
            <Typography className={styles.spacingContent} variant="subtitle1" gutterBottom component="div">
              Your wallet address:
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button className={styles.btnMetamask} startIcon={<MetaMaskIcon />}>
                {wallet.address}
              </Button>
              <ButtonIcon onClick={onDisconnect} icon={<LogoutIcon />} />
            </Stack>
          </>
        )}
      </Container>
    </main>
  );
};

export default HomePageComponent;
