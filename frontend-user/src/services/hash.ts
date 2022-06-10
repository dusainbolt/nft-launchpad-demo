import AES from 'crypto-js/aes';
import encUTF8 from 'crypto-js/enc-utf8';

export default class Hash {
  static privateKey = process.env.NEXT_PUBLIC_APP_KEY as string;

  static encryptAES = (data?: any): string => {
    return AES.encrypt(JSON.stringify(data), Hash.privateKey).toString();
  };

  static decryptAES = (hash?: any): string => {
    const bytes = AES.decrypt(hash, Hash.privateKey);
    return JSON.parse(bytes.toString(encUTF8));
  };
}
