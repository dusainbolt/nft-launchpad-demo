const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClaimSchema = new Schema(
  {
    owner: {
      type: String,
      require: true,
    },
    amount: {
      type: Number,
      require: true,
    },
    transactionHash: {
      type: String,
      require: true,
    },
  },
  { usePushEach: true, timestamps: true }
);

ClaimSchema.index({ owner: 1 }, { background: true });

module.exports = mongoose.model('claim', ClaimSchema);
