const mongoose = require('mongoose');

const tenderSchema = new mongoose.Schema({
  title: String,
  details: String,
  value: Number,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bids: [{
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number
  }]
});

module.exports = mongoose.model('Tender', tenderSchema);