import { TokenIcon } from '@asset/icon/TokenIcon';
import { Button } from '@common/Button';
import { CardActions, Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { getWalletSlice } from '@redux/slices/walletSlice';
import { useAppSelector } from '@redux/store';

export const NFTCard = ({ nft }) => {
  const wallet = useAppSelector(getWalletSlice);
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
        <Button size="small" disabled={wallet.address === nft?.owner} variant="contained">
          Buy
        </Button>
      </CardActions>
    </Card>
  );
};
