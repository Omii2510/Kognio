const { processCommand } = require('../services/nlpService');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const { checkAndCreateAlert } = require('../services/alertService');

exports.processVoiceCommand = async (req, res) => {
  try {
    const { command } = req.body;
    const intent = await processCommand(command);

    let result;
    switch (intent.action) {
      case 'add_stock':
        result = await handleAddStock(intent, command);
        break;
      case 'remove_stock':
        result = await handleRemoveStock(intent, command);
        break;
      case 'view_product':
        result = await handleViewProduct(intent);
        break;
      case 'list_products':
        result = await handleListProducts(intent);
        break;
      case 'create_product':
        result = await handleCreateProduct(intent);
        break;
      case 'low_stock':
        result = await handleLowStock();
        break;
      default:
        return res.status(400).json({ message: 'Command not understood' });
    }

    res.json({ intent, result, response: generateResponse(intent, result) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleAddStock = async (intent, commandText) => {
  let product;
  
  // Use matched product if available
  if (intent.matched_product) {
    product = intent.matched_product;
  } else {
    product = await Product.findOne({ name: new RegExp(intent.product_name, 'i') });
  }
  
  if (!product) {
    throw new Error(`Product "${intent.product_name}" not found. Try: "Create product ${intent.product_name} with price [amount]" first.`);
  }

  const previousQuantity = product.quantity;
  product.quantity += intent.quantity;
  await product.save();

  await Transaction.create({
    product: product._id,
    type: 'add',
    quantity: intent.quantity,
    previousQuantity,
    newQuantity: product.quantity,
    commandText
  });

  await checkAndCreateAlert(product);
  return product;
};

const handleRemoveStock = async (intent, commandText) => {
  let product;
  
  // Use matched product if available
  if (intent.matched_product) {
    product = intent.matched_product;
  } else {
    product = await Product.findOne({ name: new RegExp(intent.product_name, 'i') });
  }
  
  if (!product) {
    throw new Error(`Product "${intent.product_name}" not found. Please create it first.`);
  }
  if (product.quantity < intent.quantity) {
    throw new Error(`Insufficient stock. Current stock: ${product.quantity}, Requested: ${intent.quantity}`);
  }

  const previousQuantity = product.quantity;
  product.quantity -= intent.quantity;
  await product.save();

  await Transaction.create({
    product: product._id,
    type: 'remove',
    quantity: intent.quantity,
    previousQuantity,
    newQuantity: product.quantity,
    commandText
  });

  await checkAndCreateAlert(product);
  return product;
};

const handleViewProduct = async (intent) => {
  if (intent.matched_product) {
    return await Product.findById(intent.matched_product._id).populate('category');
  }
  return await Product.findOne({ name: new RegExp(intent.product_name, 'i') }).populate('category');
};

const handleListProducts = async (intent) => {
  const query = intent.category ? { category: intent.category } : {};
  return await Product.find(query).limit(20);
};

const handleCreateProduct = async (intent) => {
  const product = await Product.create({
    name: intent.product_name,
    price: intent.price || 0,
    quantity: intent.quantity || 0
  });
  await checkAndCreateAlert(product);
  return product;
};

const handleLowStock = async () => {
  return await Product.find({ $expr: { $lte: ['$quantity', '$minStockLevel'] } });
};

const generateResponse = (intent, result) => {
  const productName = intent.matched_product ? `${intent.product_name} (matched from "${intent.original_name}")` : intent.product_name;
  
  switch (intent.action) {
    case 'add_stock':
      return `Added ${intent.quantity} units to ${productName}. New quantity: ${result.quantity}`;
    case 'remove_stock':
      return `Removed ${intent.quantity} units from ${productName}. New quantity: ${result.quantity}`;
    case 'view_product':
      return result ? `${result.name}: ${result.quantity} units at ₹${result.price} each` : 'Product not found';
    case 'list_products':
      return `Found ${result.length} products`;
    case 'create_product':
      return `Created product: ${result.name}`;
    case 'low_stock':
      return `${result.length} products are low on stock`;
    default:
      return 'Command processed';
  }
};
