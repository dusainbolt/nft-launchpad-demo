import { TokenIcon } from '@asset/icon/TokenIcon';
import { Button } from '@common/Button';
import { CardActions, Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { getWalletSlice } from '@redux/slices/walletSlice';
import { useAppSelector } from '@redux/store';
import { abiBuyNftAPI } from '@request/nftRequest';
import { ContractService } from '@services/contract';
import Helper from '@services/helper';
import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import { useCallback, useState } from 'react';

export const NFTCard = ({ nft }) => {
  const wallet = useAppSelector(getWalletSlice);
  const { account, library } = useWeb3React();
  const [loadingBuy, setLoadingBuy] = useState<boolean>(false);

  const callbackBuy = (e) => {
    setLoadingBuy(false);
  };

  const handleBuyNFT = useCallback(async () => {
    setLoadingBuy(true);
    try {
      const data = await abiBuyNftAPI(nft._id, { buyer: account });
      const contractService = new ContractService(library, account as any);
      const tokenContract = contractService.getContractToken();
      const allowance = (await tokenContract.allowance(account, contractService.buyNFTAddress)) as BigNumber;
      if (allowance.eq(0)) {
        await contractService.approveToken();
      }
      await contractService.callBuyNFT(data.data, callbackBuy);
    } catch (e) {
      setLoadingBuy(false);
    }
  }, [account, library]);

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
      </CardActions>
    </Card>
  );
};
