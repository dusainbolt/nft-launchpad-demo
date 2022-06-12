const { _claimRepo } = require('../repositories');
const { BigNumber: BN } = require('ethers');

/* eslint-disable no-unsafe-optional-chaining */
async function claim(event) {
  console.log('EVENT claim: ', event);
  try {
    const { stakeHolder, reward } = event?.returnValues;
    const claimData = {
      owner: stakeHolder,
      amount: BN.from(reward).div(BN.from(10).pow(18)).toNumber(),
      transactionHash: event?.transactionHash,
    };

    await _claimRepo.create(claimData);
  } catch (error) {
    _logger.error(new Error(error));
  }
}
module.exports = claim;
