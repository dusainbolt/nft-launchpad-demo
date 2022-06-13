import { TokenIcon } from '@asset/icon/TokenIcon';
import { Button } from '@common/Button';
import { NFTCard } from '@common/Card/NFTCard';
import { Layout } from '@common/Layout';
import { CustomNoRowsOverlay } from '@common/TableGrid/CustomNoRowsOverlay';
import useFetchStaking from '@hooks/useFetchMyStaking';
import { Box, Divider, Grid, Stack } from '@mui/material';
import { ContractService } from '@services/contract';
import Helper from '@services/helper';
import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import { FC, useCallback, useState } from 'react';
import { ModalClaimHistory } from './ModelClaimHistory';

const StakingComponent: FC<any> = () => {
  const { listNFT, stakingInfo, getStakingInfo } = useFetchStaking();
  const { account, library } = useWeb3React();
  const [loadingTransaction, setLoadingTransaction] = useState<boolean>(false);
  const [visibleModalClaimHistory, setVisibleModalClaimHistory] = useState<boolean>(false);

  const handleClaimReward = useCallback(async () => {
    setLoadingTransaction(true);
    try {
      const contractService = new ContractService(library, account as any);
      await contractService.claimReward();
      await getStakingInfo();
    } catch (e) {
      console.log('error: ', e);
    }
    setLoadingTransaction(false);
  }, [account, library]);

  const toggleModalClaimHistory = () => {
    setVisibleModalClaimHistory((visible) => !visible);
  };

  return (
    <Layout>
      {account ? (
        <>
          <Box
            sx={{
              border: '1px solid #dc6a00',
              borderRadius: 4,
              padding: '20px',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <div>Total Supply</div>
                <div>{Helper.getCurrencyVal(stakingInfo?.totalSupply)}</div>
              </Grid>
              <Grid item xs={4}>
                <div>Reward Per Token</div>
                <div>{Helper.getCurrencyVal(stakingInfo?.rewardPerToken)}</div>
              </Grid>
              <Grid item xs={4}>
                <div>Reward Token</div>
                <Stack direction="row" alignItems="center">
                  <TokenIcon size={30} />
                  <span style={{ fontSize: 14, marginLeft: 5, display: 'block', color: '#dc6a00' }}>LHD</span>
                </Stack>
              </Grid>
            </Grid>

            <Grid container sx={{ marginTop: 2 }} spacing={2}>
              <Grid item xs={4}>
                <div>Your balance</div>
                <div
                  style={{
                    color: '#dc6a00',
                    fontWeight: 700,
                    fontSize: 20,
                  }}
                >
                  {Helper.getCurrencyVal(stakingInfo?.balance)}
                </div>
              </Grid>
              <Grid item xs={4}>
                <div>Earned</div>
                <div
                  style={{
                    color: '#dc6a00',
                    fontWeight: 700,
                    fontSize: 20,
                  }}
                >
                  {Helper.getCurrencyVal(stakingInfo?.earn)}
                </div>
              </Grid>
              {(stakingInfo?.earn as BigNumber)?.gt(0) && (
                <Grid item xs={1}>
                  <div>
                    <Button
                      size="small"
                      loading={loadingTransaction}
                      onClick={handleClaimReward}
                      loadingIndicator="Processing"
                      variant="contained"
                      sx={{ width: 'max-content', minWidth: 100 }}
                    >
                      Claim Reward
                    </Button>
                  </div>
                </Grid>
              )}
            </Grid>
          </Box>
          <Button sx={{ marginTop: 3 }} variant="contained" onClick={toggleModalClaimHistory}>
            View Claim History
          </Button>
          <Divider sx={{ marginTop: 3, fontWeight: 600, fontSize: 20, marginBottom: 2 }} textAlign="left">
            Your stake Item
          </Divider>
          <Grid container spacing={2}>
            {listNFT.length ? (
              listNFT.map((item, index) => (
                <Grid key={index} item xs={12} md={6} lg={4} xl={3}>
                  <NFTCard nft={item} btnUnstake />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <CustomNoRowsOverlay />
              </Grid>
            )}
          </Grid>
          <ModalClaimHistory open={visibleModalClaimHistory} toggleModal={toggleModalClaimHistory} />
        </>
      ) : (
        'Please click metamask to Connect Wallet '
      )}
    </Layout>
  );
};

export default StakingComponent;
