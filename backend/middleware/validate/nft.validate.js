const { body, query } = require('express-validator');
const web3 = require('web3');

module.exports = {
  className: 'validateNFT',
  create: () => {
    return [
      body('owner').not().isEmpty().withMessage('Missing name parameter.'),
      body('name').not().isEmpty().withMessage('Missing value parameter.'),
      body('image').not().isEmpty().withMessage('Missing image parameter.'),
      body('description')
        .not()
        .isEmpty()
        .withMessage('Missing description parameter.'),
      body('ipfsURI').not().isEmpty().withMessage('Missing ipfsURI parameter.'),
      body('price')
        .not()
        .isEmpty()
        .withMessage('Missing price parameter.')
        .isInt({ gt: 0 })
        .withMessage('price invalid'),
      body('signature')
        .not()
        .isEmpty()
        .withMessage('Missing signature parameter.'),
    ];
  },

  buyABI: () => {
    return [
      query('buyer')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Missing buyer parameter.')
        .custom((value) => {
          const isAddress = web3.utils.isAddress(value);
          return isAddress
            ? Promise.resolve(true)
            : Promise.reject('Invalid buyer address');
        }),
    ];
  },
};
