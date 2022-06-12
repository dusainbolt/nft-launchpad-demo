const { _NFTTransferModel } = require('../models');

module.exports = {
  className: '_nftTransferRepo',

  create: function (conditions) {
    return _NFTTransferModel.create(conditions);
  },

  findOne: function (conditions) {
    return _NFTTransferModel.findOne(conditions);
  },

  count: function (conditions) {
    return _NFTTransferModel.countDocuments(conditions);
  },

  search: function (conditions, pagination, sortConditions) {
    return _NFTTransferModel
      .find(conditions)
      .skip((pagination.page - 1) * pagination.pageSize)
      .limit(pagination.pageSize)
      .sort(sortConditions);
  },
};
