const { _ClaimModel } = require('../models');

module.exports = {
  className: '_nftRepo',

  create: function (conditions) {
    return _ClaimModel.create(conditions);
  },

  search: function (conditions, pagination, sortConditions) {
    return _ClaimModel
      .find(conditions)
      .skip((pagination.page - 1) * pagination.pageSize)
      .limit(pagination.pageSize)
      .sort(sortConditions);
  },
};
