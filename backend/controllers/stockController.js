const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const { checkAndCreateAlert } = require('../services/alertService');

exports.addStock = async (req, res) => {
  try {
    const { productId, quantity, reason } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const previousQuantity = product.quantity;
    product.quantity += quantity;
    await product.save();

    await Transaction.create({
      product: productId,
      type: 'add',
      quantity,
      previousQuantity,
      newQuantity: product.quantity,
      reason
    });

    await checkAndCreateAlert(product);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeStock = async (req, res) => {
  try {
    const { productId, quantity, reason } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.quantity < quantity) return res.status(400).json({ message: 'Insufficient stock' });

    const previousQuantity = product.quantity;
    product.quantity -= quantity;
    await product.save();

    await Transaction.create({
      product: productId,
      type: 'remove',
      quantity,
      previousQuantity,
      newQuantity: product.quantity,
      reason
    });

    await checkAndCreateAlert(product);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLowStock = async (req, res) => {
  try {
    const products = await Product.find({ $expr: { $lte: ['$quantity', '$minStockLevel'] } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStockValue = async (req, res) => {
  try {
    const result = await Product.aggregate([
      { $group: { _id: null, totalValue: { $sum: { $multiply: ['$quantity', '$price'] } } } }
    ]);
    res.json({ totalValue: result[0]?.totalValue || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
