class _helper {
  static checkSignature = async (address, signature, message) => {
    try {
      // verify signature
      const recover = await web3.eth.accounts.recover(message, signature);
      const recoverConvert = web3.utils.toChecksumAddress(recover);
      address = web3.utils.toChecksumAddress(address);

      return (
        recoverConvert && recoverConvert.toLowerCase() === address.toLowerCase()
      );
    } catch (error) {
      _logger.error(new Error(error));
    }
  };
}

module.exports = _helper;
