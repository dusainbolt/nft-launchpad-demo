const { _nftRepo } = require('../repositories');
const _helper = require('../utils/helper');
const { handlerSuccess, handlerError } = require('../utils/response_handler');

module.exports = {
  className: 'nftController',

  create: async (req, res, next) => {
    try {
      const { body } = req;

      const messageObj = {
        ipfsURI: body.ipfsURI,
        price: body.price,
        image: body.image,
        name: body.name,
      };

      const message = JSON.stringify(messageObj);

      if (
        !(await _helper.checkSignature(body.signature, body.owner, message))
      ) {
        return handlerError(req, res, 'INVALID_SIGNATURE');
      }

      const createNFTData = {
        ...messageObj,
        description: body.description,
        owner: body.owner,
      };

      const nft = await _nftRepo.create(createNFTData);

      return handlerSuccess(req, res, nft, 'CREATE_SUCCESS');
    } catch (error) {
      _logger.error(new Error(error));
      next(error);
    }
  },
};
