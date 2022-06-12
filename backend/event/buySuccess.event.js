const { _nftRepo, _nftTransferRepo } = require('../repositories');
const consts = require('../utils/consts');
const { NFT_STATUS } = require('../utils/consts');

/* eslint-disable no-unsafe-optional-chaining */
async function buySuccess(event) {
  console.log('EVENT buySuccess: ', event);
  try {
    const { buyer, tokenId } = event?.returnValues;
    const nft = await _nftRepo.findOne({ tokenId });

    const nftTransferData = {
      from: nft.owner,
      to: buyer,
      transactionHash: event?.transactionHash,
      contractAddress: event?.address,
      nftId: nft._id,
      type: consts.TRANSFER_TYPE.BUY,
    };

    await _nftTransferRepo.create(nftTransferData);

    nft.status = NFT_STATUS.BOUGHT;
    nft.owner = buyer;

    await nft.save();
  } catch (error) {
    _logger.error(new Error(error));
  }
}
module.exports = buySuccess;
