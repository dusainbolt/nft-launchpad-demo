import { create as ipfsHttpClient } from 'ipfs-http-client';

export default class Helper {
  static objValue = (object: any, key: any): any => {
    return object[key];
  };

  static delay = (timeMilliSecond = 1000) => new Promise((resolve) => setTimeout(() => resolve(null), timeMilliSecond));

  static splitString = (hex: string | null | undefined, numStart = 6, numEnd = 4): string => {
    if (!hex?.length) return '';
    if (hex?.length < numStart + numEnd) return hex;
    return `${hex?.substring(0, numStart)}...${hex.substring(hex.length - numEnd)}`;
  };

  static getEtherUrl = (txId: string) => `${process.env.NEXT_PUBLIC_ETHER_SCAN}/tx/${txId}`;

  static ipfs = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0' as any);

  static ipfsPath = (added) => `https://ipfs.infura.io/ipfs/${added.path}`;
}
