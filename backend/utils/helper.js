const Web3 = require('web3');
const consts = require('./consts');

const web3 = new Web3();
class _helper {
  static checkSignature = async (address, signature, message) => {
    try {
      // verify signature
      const recover = await web3.eth.accounts.recover(message, signature);
      console.log('recover: ', recover);
      const recoverConvert = web3.utils.toChecksumAddress(recover);
      address = web3.utils.toChecksumAddress(address);
      console.log('recover: ', recover, recoverConvert, address);

      return (
        recoverConvert && recoverConvert.toLowerCase() === address.toLowerCase()
      );
    } catch (error) {
      _logger.error(new Error(error));
    }
  };

  static renderPaginateSort = (query) => {
    const convertConditionsSort = (string) => {
      const arrayString = string.split(',');
      let result = {};
      for (index in arrayString) {
        const element = arrayString[index];
        const fieldName = element?.substring(1);
        result = {
          ...result,
          [fieldName]:
            element?.indexOf('-') !== -1 ? consts.SORT.DESC : consts.SORT.ASC,
        };
      }
      return result;
    };
    return {
      pagination: {
        page: parseInt(query.page) || 1,
        pageSize: parseInt(query.pageSize) || 10000000,
      },
      sortConditions: query.sortBy
        ? convertConditionsSort(query.sortBy)
        : { createdAt: consts.SORT.DESC },
    };
  };
}

module.exports = _helper;
