const { _nftRepo, _nftTransferRepo, _claimRepo } = require('../repositories');
const consts = require('../utils/consts');
const _helper = require('../utils/helper');
const { handlerSuccess, handlerError } = require('../utils/response_handler');
const ethers = require('ethers');
const Web3 = require('web3');
const web3 = new Web3();

module.exports = {
  className: 'nftController',

  create: async (req, res, next) => {
    try {
      const { body } = req;

      const messageObj = {
        name: body.name,
        description: body.description,
        image: body.image,
        attributes: body?.attributes || [],
        ipfsURI: body.ipfsURI,
        price: body.price.toString(),
      };

      const message = JSON.stringify(messageObj);

      if (
        !(await _helper.checkSignature(body.owner, body.signature, message))
      ) {
        return handlerError(req, res, 'INVALID_SIGNATURE');
      }

      const count = await _nftRepo.count();
      const createNFTData = {
        ...messageObj,
        owner: body.owner,
        tokenId: count + 1,
      };

      const nft = await _nftRepo.create(createNFTData);

      return handlerSuccess(req, res, nft, 'CREATE_SUCCESS');
    } catch (error) {
      _logger.error(new Error(error));
      next(error);
    }
  },

  search: async (req, res, next) => {
    try {
      const { owner, status } = req.query;
      const { pagination, sortConditions } = _helper.renderPaginateSort(
        req.query
      );

      // prepare search conditions
      const conditions = {
        ...(owner &&
          owner.length > 0 && {
            owner,
          }),
        ...(status && {
          status,
        }),
      };

      const data = await _nftRepo.search(
        conditions,
        pagination,
        sortConditions
      );

      return handlerSuccess(req, res, data, 'GET_DATA_SUCCESS');
    } catch (error) {
      _logger.error(new Error(error));
      next(error);
    }
  },

  genABIBuyToken: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { buyer } = req.query;

      const nft = await _nftRepo.findOne({
        _id: id,
        status: consts.NFT_STATUS.CREATED,
        owner: { $ne: buyer },
      });

      if (!nft) {
        return handlerError(req, res, 'INVALID_NFT');
      }

      const price = ethers.utils.parseUnits(nft.price.toString(), 18);

      const messageHash = ethers.utils.solidityKeccak256(
        ['address', 'string', 'uint256', 'uint256', 'address'],
        [buyer, nft.ipfsURI, nft.tokenId, price, nft.owner]
      );

      const signature = web3.eth.accounts.sign(
        messageHash,
        process.env.PRIVATE_KEY_OWNER
      ).signature;

      // const data = await _buyNFTContract.methods.balanceOf(buyer).call();

      const abiEncode = _buyNFTContract.methods
        .buyNFT(nft.ipfsURI, nft.tokenId, price, nft.owner, signature)
        .encodeABI();

      return handlerSuccess(req, res, abiEncode, 'GET_DATA_SUCCESS');
    } catch (error) {
      _logger.error(new Error(error));
      next(error);
    }
  },

  genABIStakeToken: async (req, res, next) => {
    try {
      const { id } = req.params;

      const nft = await _nftRepo.findOne({
        _id: id,
        status: consts.NFT_STATUS.BOUGHT,
      });

      if (!nft) {
        return handlerError(req, res, 'INVALID_NFT');
      }

      const price = ethers.utils.parseUnits(nft.price.toString(), 18);

      const messageHash = ethers.utils.solidityKeccak256(
        ['address', 'uint256', 'uint256'],
        [nft.owner, nft.tokenId, price]
      );

      const signature = web3.eth.accounts.sign(
        messageHash,
        process.env.PRIVATE_KEY_OWNER
      ).signature;

      // const data = await _buyNFTContract.methods.balanceOf(buyer).call();

      const abiEncode = _stakeNFTContract.methods
        .stake(nft.tokenId, price, signature)
        .encodeABI();

      return handlerSuccess(req, res, abiEncode, 'GET_DATA_SUCCESS');
    } catch (error) {
      _logger.error(new Error(error));
      next(error);
    }
  },

  searchTransfer: async (req, res, next) => {
    try {
      const { owner } = req.params;
      const { pagination, sortConditions } = _helper.renderPaginateSort(
        req.query
      );

      // prepare search conditions
      const conditions = {
        $or: [{ to: owner }, { from: owner }],
      };

      const data = await _nftTransferRepo.search(
        conditions,
        pagination,
        sortConditions
      );

      return handlerSuccess(req, res, data, 'GET_DATA_SUCCESS');
    } catch (error) {
      _logger.error(new Error(error));
      next(error);
    }
  },

  searchClaim: async (req, res, next) => {
    try {
      const { owner } = req.params;
      const { pagination, sortConditions } = _helper.renderPaginateSort(
        req.query
      );

      // prepare search conditions
      const conditions = {
        owner,
      };

      const data = await _claimRepo.search(
        conditions,
        pagination,
        sortConditions
      );

      return handlerSuccess(req, res, data, 'GET_DATA_SUCCESS');
    } catch (error) {
      _logger.error(new Error(error));
      next(error);
    }
  },
};
