import MyNFTComponent from '@components/myNFT/MyNFTComponent';
import { useConnectProvider } from '@hooks/useConnectProvider';
import { wrapper } from '@redux/store';
import { SSGContext } from '@type/context';
import Head from 'next/head';
import { FC, Fragment } from 'react';

const MyNFT: FC<any> = () => {
  useConnectProvider();
  return (
    <Fragment>
      <Head>
        <title>NFT Launchpad Demo</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <MyNFTComponent />
    </Fragment>
  );
};

export const getStaticProps = wrapper.getStaticProps((): SSGContext | any => async () => {});

export default MyNFT;
