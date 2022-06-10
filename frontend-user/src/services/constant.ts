export default class Constant {
  static FORM = {
    UNKNOWN_LABEL: 'Unknown label',
    TYPE_TEXT: 'text',
    TYPE_PASSWORD: 'password',
  };

  static ENV = {
    ETH_CHAIN_ID: Number(process.env.NEXT_PUBLIC_ETH_CHAIN_ID),
    RPC_ETH: process.env.NEXT_PUBLIC_RPC_ETH,
  };

  static CODE = {
    ALREADY_PENDING_REQUEST: -32002,
    ERROR_AUTHENTICATION: 401,
    ERROR_RESPONSE: 500,
    SUCCESS_RESPONSE: 200,
  };

  static DATE = {
    D_M_Y: 'DD/MM/YYYY',
    D_M_Y_H_M: 'DD/MM/YYYY HH:mm',
  };
}
