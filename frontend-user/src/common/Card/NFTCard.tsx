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
import { useWeb3React } from '@web3-react/core';
import { useCallback, useState } from 'react';

export const NFTCard = ({ nft }) => {
  const wallet = useAppSelector(getWalletSlice);
  const { account, library } = useWeb3React();
  const [loadingBuy, setLoadingBuy] = useState<boolean>(false);

  const callbackBuy = (e) => {
    console.log(e);
  };

  const handleBuyNFT = useCallback(async () => {
    setLoadingBuy(true);
    try {
      const data = await abiBuyNftAPI(nft._id, { buyer: account });
      const contractService = new ContractService(library, account as any);
      // await contractService.approveToken();
      await contractService.callBuyNFT(data.data, callbackBuy);
      setLoadingBuy(false);
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
        <div style={{ marginTop: 12 }}>Price</div>
        <Stack direction="row" spacing={1} alignItems="center">
          <TokenIcon />
          <div>
            $<b>{nft?.price}</b>
          </div>
          <div>LDH</div>
        </Stack>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          disabled={wallet.address === nft?.owner || loadingBuy}
          onClick={handleBuyNFT}
          variant="contained"
        >
          Buy
        </Button>
      </CardActions>
    </Card>
  );
};
