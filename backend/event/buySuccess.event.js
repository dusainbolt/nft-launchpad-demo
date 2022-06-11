const { _nftRepo } = require('../repositories');
const { NFT_STATUS } = require('../utils/consts');

/* eslint-disable no-unsafe-optional-chaining */
async function buySuccess(event) {
  console.log('eventBLC, ', event);
  try {
    const { buyer, tokenId, tokenURI } = event?.returnValues;

    const nft = await _nftRepo.findOne({ ipfsURI: tokenURI });
    nft.status = NFT_STATUS.BOUGHT;
    nft.tokenId = tokenId;
    nft.owner = buyer;
    await nft.save();
  } catch (error) {
    _logger.error(new Error(error));
  }
}
module.exports = buySuccess;
