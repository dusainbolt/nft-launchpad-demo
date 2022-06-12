import { TokenIcon } from '@asset/icon/TokenIcon';
import { Button } from '@common/Button';
import { CardActions, Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { getWalletSlice } from '@redux/slices/walletSlice';
import { useAppSelector } from '@redux/store';
import { abiBuyNftAPI, abiStakeNftAPI } from '@request/nftRequest';
import { ContractService } from '@services/contract';
import Helper from '@services/helper';
import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import { useRouter } from 'next/dist/client/router';
import { useCallback, useState } from 'react';

export const NFTCard = ({ nft, btnBuy = true, btnStake = false, btnUnstake = false }) => {
  const wallet = useAppSelector(getWalletSlice);
  const { account, library } = useWeb3React();
  const [loadingBuy, setLoadingBuy] = useState<boolean>(false);
  const router = useRouter();

  const callbackBuyNFT = () => {
    setLoadingBuy(false);
    router.push('/my-nft');
  };

  const callbackStakeNFT = () => {
    setLoadingBuy(false);
    router.push('/staking');
  };

  const callBackUnstakeNFT = () => {
    setLoadingBuy(false);
    setTimeout(() => {
      router.push('/my-nft');
    }, 1000);
  };

  const handleBuyNFT = useCallback(async () => {
    if (!account) {
      alert('Please connect wallet to buy NFT');
    }
    setLoadingBuy(true);
    try {
      const data = await abiBuyNftAPI(nft._id, { buyer: account });
      const contractService = new ContractService(library, account as any);
      const tokenContract = contractService.getContractToken();
      const allowance = (await tokenContract.allowance(account, contractService.buyNFTAddress)) as BigNumber;
      if (allowance.eq(0)) {
        await contractService.approveToken();
      }
      await contractService.sendTransaction(data.data, contractService.buyNFTAddress, callbackBuyNFT);
    } catch (e) {
      setLoadingBuy(false);
    }
  }, [account, library]);

  const handleStakeNFT = useCallback(async () => {
    setLoadingBuy(true);
    try {
      const data = await abiStakeNftAPI(nft._id);
      const contractService = new ContractService(library, account as any);
      const nftContract = contractService.getContractNFT();
      const approveAll = await nftContract.isApprovedForAll(account, contractService.stakeAddress);
      if (!approveAll) {
        alert('You must be approve all for staking contract');
        await contractService.approveAllStake();
      }
      await contractService.sendTransaction(data.data, contractService.stakeAddress, callbackStakeNFT);
    } catch (e) {
      setLoadingBuy(false);
    }
  }, [account, library]);

  const handleUnStakeNFT = useCallback(async () => {
    setLoadingBuy(true);
    try {
      const contractService = new ContractService(library, account as any);
      await contractService.unstake(nft?.tokenId);
      callBackUnstakeNFT();
    } catch (e) {
      setLoadingBuy(false);
    }
  }, [account, library]);

  const showBtnBuy = !btnUnstake && btnBuy && !btnStake;
  const showbtnStakeUnstake = btnStake || btnUnstake;

  return (
    <Card sx={{ width: '100%' }}>
      <CardMedia component="img" height="180" image={nft?.image || ''} alt="green iguana" />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {nft?.name || ''}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {nft?.description || ''}
        </Typography>
        <Stack direction="row" spacing={5}>
          <div>
            <div style={{ marginTop: 12 }}>Price</div>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <TokenIcon />
              <div style={{ color: '#dc6a00', fontSize: 20 }}>
                $<b>{nft?.price}</b>
              </div>
              <span style={{ fontSize: 11, marginLeft: 5, display: 'block', color: '#dc6a00' }}>LHD</span>
            </Stack>
          </div>
          <div>
            <div style={{ marginTop: 12 }}>Owner</div>
            <Stack
              direction="row"
              spacing={1}
              sx={{ border: '1px solid #dc6a00', borderRadius: 12, padding: '3px 10px', color: '#dc6a00' }}
              alignItems="center"
            >
              {Helper.splitString(nft?.owner)}
            </Stack>
          </div>
        </Stack>
      </CardContent>
      <CardActions>
        {showBtnBuy && (
          <Button
            size="small"
            disabled={wallet?.address === nft?.owner}
            loading={loadingBuy}
            onClick={handleBuyNFT}
            loadingIndicator="Processing"
            variant="contained"
            sx={{ width: 'max-content', minWidth: 100 }}
          >
            Buy
          </Button>
        )}

        {showbtnStakeUnstake && (
          <Button
            size="small"
            loading={loadingBuy}
            onClick={btnUnstake ? handleUnStakeNFT : handleStakeNFT}
            loadingIndicator="Processing"
            variant="contained"
            sx={{ width: 'max-content', minWidth: 100 }}
          >
            {btnUnstake ? 'Unstake' : 'Stake'}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};
