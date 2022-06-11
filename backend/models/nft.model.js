const mongoose = require('mongoose');
const consts = require('../utils/consts');
const Schema = mongoose.Schema;

const NFTSchema = new Schema(
  {
    owner: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    ipfsURI: {
      type: String,
      require: true,
    },
    attributes: [],
    status: {
      type: Number,
      enum: consts.NFT_STATUS,
      default: consts.NFT_STATUS.CREATED,
    },
  },
  { usePushEach: true, timestamps: true }
);

NFTSchema.index({ owner: 1 }, { background: true });

module.exports = mongoose.model('Nft', NFTSchema);
