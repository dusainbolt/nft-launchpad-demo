const mongoose = require('mongoose');
const consts = require('../utils/consts');
const Schema = mongoose.Schema;

const NFTTransfer = new Schema(
  {
    from: {
      type: String,
      require: true,
    },
    to: {
      type: String,
      require: true,
    },
    transactionHash: {
      type: String,
      require: true,
    },
    contractAddress: {
      type: String,
      require: true,
    },
    nftId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Nft',
    },
    type: {
      type: Number,
      enum: consts.TRANSFER_TYPE,
      required: true,
    },
  },
  { usePushEach: true, timestamps: true }
);

NFTTransfer.index({ from: 1, to: 1 }, { background: true });

module.exports = mongoose.model('NftTransfer', NFTTransfer);
