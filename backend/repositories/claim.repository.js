const { _ClaimModel } = require('../models');

module.exports = {
  className: '_nftRepo',

  create: function (conditions) {
    return _ClaimModel.create(conditions);
  },
};
