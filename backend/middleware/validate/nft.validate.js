const { body } = require('express-validator');

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
};
