const Web3 = require('web3');
const BuyNFTJson = require('../config/BuyNFT.json');
const StakeNFTJson = require('../config/StakingNFT.json');
const staked = require('./staked.event');
const buySuccess = require('./buySuccess.event');
const unstaked = require('./unstake.event');
const claim = require('./claim.event');

const web3 = new Web3(process.env.PROVIDER_URL);

global._buyNFTContract = new web3.eth.Contract(
  BuyNFTJson.abi,
  process.env.BUY_NFT_ADDRESS
);

global._stakeNFTContract = new web3.eth.Contract(
  StakeNFTJson.abi,
  process.env.STAKING_NFT_ADDRESS
);

console.log('env.PROVIDER_URL: ', process.env.PROVIDER_URL);
console.log('env.BUY_NFT_ADDRESS: ', process.env.BUY_NFT_ADDRESS);
console.log('env.STAKING_NFT_ADDRESS: ', process.env.STAKING_NFT_ADDRESS);

const options = {
  filter: {
    value: [],
  },
  // fromBlock: 0,
  // fromBlock: 'latest', //Number || "earliest" || "pending" || "latest"
  // toBlock: 'latest',
};

function eventListener() {
  _buyNFTContract.events
    .BuySuccess(options)
    .on('data', buySuccess)
    .on('changed', (changed) => console.log(changed))
    .on('error', (err) => console.log('Error', err))
    .on('connected', (str) => console.log(str));
  _stakeNFTContract.events
    .Staked(options)
    .on('data', staked)
    .on('changed', (changed) => console.log(changed))
    .on('error', (err) => console.log('Error', err))
    .on('connected', (str) => console.log(str));
  _stakeNFTContract.events
    .Unstaked(options)
    .on('data', unstaked)
    .on('changed', (changed) => console.log(changed))
    .on('error', (err) => console.log('Error', err))
    .on('connected', (str) => console.log(str));
  _stakeNFTContract.events
    .RewardPaid(options)
    .on('data', claim)
    .on('changed', (changed) => console.log(changed))
    .on('error', (err) => console.log('Error', err))
    .on('connected', (str) => console.log(str));
}

module.exports = eventListener;
