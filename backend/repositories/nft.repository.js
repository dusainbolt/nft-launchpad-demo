const { _NFTModel } = require('../models');

module.exports = {
  className: '_nftRepo',

  create: function (conditions) {
    return _NFTModel.create(conditions);
  },

  findOne: function (conditions) {
    return _NFTModel.findOne(conditions);
  },

  count: function (conditions) {
    return _NFTModel.countDocuments(conditions);
  },

  search: function (conditions, pagination, sortConditions) {
    return _NFTModel
      .find(conditions)
      .skip((pagination.page - 1) * pagination.pageSize)
      .limit(pagination.pageSize)
      .sort(sortConditions);
  },
};
