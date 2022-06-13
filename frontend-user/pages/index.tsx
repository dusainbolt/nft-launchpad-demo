import HomeComponent from '@components/index/HomeComponent';
import { useConnectProvider } from '@hooks/useConnectProvider';
import { wrapper } from '@redux/store';
import { SSGContext } from '@type/context';
import { FC, Fragment } from 'react';

const Home: FC<any> = () => {
  useConnectProvider();
  return (
    <Fragment>
      {/* <Head>
        <title>NFT Launchpad Demo</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head> */}
      <HomeComponent />
    </Fragment>
  );
};

export const getStaticProps = wrapper.getStaticProps((): SSGContext | any => async () => {});

export default Home;
