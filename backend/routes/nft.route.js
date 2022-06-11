const express = require('express');
const { nftController } = require('../controllers');
const validate = require('../middleware/validate');
const nftValidate = require('../middleware/validate/nft.validate');
const router = express.Router();

/* NFT APIs */
router.post('/nft', nftValidate.create(), validate, nftController.create);

module.exports = router;
