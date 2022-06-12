const { _nftRepo, _nftTransferRepo } = require('../repositories');
const { NFT_STATUS, TRANSFER_TYPE } = require('../utils/consts');

/* eslint-disable no-unsafe-optional-chaining */
async function staked(event) {
  console.log('EVENT staked: ', event);
  try {
    const { stakeHolder, tokenId } = event?.returnValues;
    const nft = await _nftRepo.findOne({ tokenId });

    const nftTransferData = {
      from: stakeHolder,
      to: event?.address,
      transactionHash: event?.transactionHash,
      contractAddress: event?.address,
      nftId: nft._id,
      type: TRANSFER_TYPE.STAKE,
    };

    await _nftTransferRepo.create(nftTransferData);

    nft.status = NFT_STATUS.STAKED;

    await nft.save();
  } catch (error) {
    _logger.error(new Error(error));
  }
}
module.exports = staked;
