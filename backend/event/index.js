const Web3 = require('web3');
const buySuccess = require('./buySuccess.event');

const BuyNFTJson = require('../config/BuyNFT.json');

const web3 = new Web3(process.env.PROVIDER_URL);

global._buyNFTContract = new web3.eth.Contract(
  BuyNFTJson.abi,
  process.env.BUY_NFT_ADDRESS
);

console.log('process.env.PROVIDER_URL: ', process.env.PROVIDER_URL);
console.log('process.env.PROVIDER_URL: ', process.env.BUY_NFT_ADDRESS);

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
}

module.exports = eventListener;
