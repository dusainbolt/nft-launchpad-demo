import StakingComponent from '@components/Staking/StakingComponent';
import { useConnectProvider } from '@hooks/useConnectProvider';
import { wrapper } from '@redux/store';
import { SSGContext } from '@type/context';
import { FC, Fragment } from 'react';

const Staking: FC<any> = () => {
  useConnectProvider();
  return (
    <Fragment>
      {/* <Head>
        <title>NFT Launchpad Demo</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head> */}
      <StakingComponent />
    </Fragment>
  );
};

export const getStaticProps = wrapper.getStaticProps((): SSGContext | any => async () => {});

export default Staking;
