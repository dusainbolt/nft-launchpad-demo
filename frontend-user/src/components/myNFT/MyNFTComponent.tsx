import { Button } from '@common/Button';
import { NFTCard } from '@common/Card/NFTCard';
import { Layout } from '@common/Layout';
import { CustomNoRowsOverlay } from '@common/TableGrid/CustomNoRowsOverlay';
import useCreateNFT from '@hooks/useCreateNFT';
import useFetchMyNFT from '@hooks/usefetchMyNFT';
import { Divider, Grid } from '@mui/material';
import Validate from '@services/validate';
import { useWeb3React } from '@web3-react/core';
import { Formik } from 'formik';
import { FC, useState } from 'react';
import * as yup from 'yup';
import { ModalCreateNFT } from './ModalCreateNFT';
import { ModalTransferHistory } from './ModelTransferHistory';

const MyNFTComponent: FC<any> = () => {
  const [visibleModalCreateNFt, setVisibleModalCreateNFT] = useState<boolean>(false);
  const [visibleModalTransferHistory, setVisibleModalTransferHistory] = useState<boolean>(false);

  const { account } = useWeb3React();
  const validateModalCreateNFT = yup.object({
    name: yup.string().required(Validate.require('Name')),
    description: yup.string().required(Validate.require('Description')),
    price: yup
      .number()
      .required(Validate.require('Price'))
      .moreThan(0, 'Price must be > 0')
      .max(100, 'Price max is 100'),
    image: yup.string().required(Validate.require('Image')),
  });

  const initialValuesNFT = {
    name: '',
    image: '',
    description: '',
    price: 0,
  };

  const toggleModalCreateNFT = () => {
    setVisibleModalCreateNFT((visible) => !visible);
  };

  const toggleModalTransferHistory = () => {
    setVisibleModalTransferHistory((visible) => !visible);
  };

  const { onFetchMyNFT, createItems, boughtItems } = useFetchMyNFT();
  const { loadingForm, onSubmitCreateNFT } = useCreateNFT(onFetchMyNFT, toggleModalCreateNFT);
  return (
    <Layout>
      {account ? (
        <>
          <Button variant="contained" onClick={toggleModalCreateNFT}>
            Create Market Item
          </Button>
          <Button sx={{ marginLeft: 3 }} variant="contained" onClick={toggleModalTransferHistory}>
            View Transfer History
          </Button>
          <Formik
            onSubmit={onSubmitCreateNFT}
            validationSchema={validateModalCreateNFT}
            initialValues={initialValuesNFT}
          >
            <>
              <ModalCreateNFT
                loading={loadingForm as any}
                toggleModal={toggleModalCreateNFT}
                open={visibleModalCreateNFt}
              />
            </>
          </Formik>
          <Divider sx={{ marginTop: 3, fontWeight: 600, fontSize: 20, marginBottom: 2 }} textAlign="left">
            Your Market Item
          </Divider>
          <Grid container spacing={2}>
            {createItems.length ? (
              createItems.map((item, index) => (
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
          <Divider sx={{ marginTop: 3, fontWeight: 600, fontSize: 20, marginBottom: 2 }} textAlign="left">
            Your Bought Items
          </Divider>
          <Grid container spacing={2}>
            {boughtItems.length ? (
              boughtItems.map((item, index) => (
                <Grid key={index} item xs={12} md={6} lg={4} xl={3}>
                  <NFTCard nft={item} btnStake />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <CustomNoRowsOverlay />
              </Grid>
            )}
          </Grid>
          <ModalTransferHistory open={visibleModalTransferHistory} toggleModal={toggleModalTransferHistory} />
        </>
      ) : (
        'Please click metamask to Connect Wallet '
      )}
    </Layout>
  );
};

export default MyNFTComponent;
