const { _nftRepo, _nftTransferRepo } = require('../repositories');
const { NFT_STATUS, TRANSFER_TYPE } = require('../utils/consts');

/* eslint-disable no-unsafe-optional-chaining */
async function unstake(event) {
  console.log('EVENT unstake: ', event);
  try {
    const { stakeHolder, tokenId } = event?.returnValues;
    const nft = await _nftRepo.findOne({ tokenId });

    const nftTransferData = {
      from: event?.address,
      to: stakeHolder,
      transactionHash: event?.transactionHash,
      contractAddress: event?.address,
      nftId: nft._id,
      type: TRANSFER_TYPE.UNSTAKE,
    };

    await _nftTransferRepo.create(nftTransferData);

    nft.status = NFT_STATUS.BOUGHT;

    await nft.save();
  } catch (error) {
    _logger.error(new Error(error));
  }
}
module.exports = unstake;
