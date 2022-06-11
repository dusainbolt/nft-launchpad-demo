const nftRoute = require('./nft.route');

module.exports = (_app) => {
  _app.use('/api', nftRoute);
};
