const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  type: { type: String, enum: ['add', 'remove', 'adjust'], required: true },
  quantity: { type: Number, required: true },
  previousQuantity: { type: Number, required: true },
  newQuantity: { type: Number, required: true },
  reason: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  commandText: String
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
