import { NFTCard } from '@common/Card/NFTCard';
import { Layout } from '@common/Layout';
import { CustomNoRowsOverlay } from '@common/TableGrid/CustomNoRowsOverlay';
import useFetchNFT from '@hooks/usefetchNFT';
import { Divider, Grid } from '@mui/material';
import { FC } from 'react';

const HomeComponent: FC<any> = () => {
  const { listNFT } = useFetchNFT();

  return (
    <Layout>
      <Divider sx={{ marginTop: 3, fontWeight: 600, fontSize: 20, marginBottom: 2 }} textAlign="left">
        Marketplace
      </Divider>
      <Grid container spacing={2}>
        {listNFT.length ? (
          listNFT.map((item, index) => (
            <Grid key={index} item xs={12} md={6} lg={4} xl={3}>
              <NFTCard nft={item} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <CustomNoRowsOverlay />
          </Grid>
        )}
      </Grid>
    </Layout>
  );
};

export default HomeComponent;
