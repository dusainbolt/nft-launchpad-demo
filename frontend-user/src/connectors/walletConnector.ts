import Constant from '@services/constant';
import { InjectedConnector } from '@web3-react/injected-connector';

export const injected = new InjectedConnector({ supportedChainIds: [Constant.ENV.ETH_CHAIN_ID] });
