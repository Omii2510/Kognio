const Alert = require('../models/Alert');

exports.checkAndCreateAlert = async (product) => {
  await Alert.deleteMany({ product: product._id, dismissed: false });

  if (product.quantity === 0) {
    await Alert.create({
      product: product._id,
      type: 'out_of_stock',
      message: `${product.name} is out of stock`
    });
  } else if (product.quantity <= product.minStockLevel) {
    await Alert.create({
      product: product._id,
      type: 'low_stock',
      message: `${product.name} is low on stock (${product.quantity} remaining)`
    });
  }
};

exports.getAlerts = async () => {
  return await Alert.find({ dismissed: false }).populate('product').sort('-createdAt');
};

exports.dismissAlert = async (alertId) => {
  return await Alert.findByIdAndUpdate(alertId, { dismissed: true });
};
