const express = require('express');
const { nftController } = require('../controllers');
const validate = require('../middleware/validate');
const nftValidate = require('../middleware/validate/nft.validate');
const router = express.Router();

/* NFT APIs */
router.post('/nft', nftValidate.create(), validate, nftController.create);
router.get('/nft', nftController.search);
router.get(
  '/nft/buy-abi/:id',
  nftValidate.buyABI(),
  validate,
  nftController.genABIBuyToken
);

router.get('/nft/stake-abi/:id', nftController.genABIStakeToken);

router.get('/nft-transfer/:owner', nftController.searchTransfer);
router.get('/claim/:owner', nftController.searchClaim);

module.exports = router;
