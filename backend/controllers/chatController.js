const { chat, clearContext } = require("../services/chatService");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");
const { formatINR } = require("../utils/currency");

/* =====================================
MAIN CHAT ROUTE
===================================== */

exports.chatWithAI = async (req, res) => {

  try {

    const { message, sessionId } = req.body;

    const ai = await chat(message, sessionId);

    if (ai.type === "conversation") {
      return res.json(ai);
    }

    if (ai.type === "batch_command") {

      const results = [];

      for (const cmd of ai.commands) {
        const r = await executeCommand(cmd);
        results.push(r.response);
      }

      return res.json({
        type:"command",
        response:results.join("\n")
      });

    }

    const result = await executeCommand(ai);

    res.json({
      type:"command",
      response:result.response,
      data:result.data
    });

  } catch (err) {

    res.status(500).json({
      type:"error",
      response:err.message
    });

  }

};

/* =====================================
COMMAND EXECUTION
===================================== */

async function executeCommand(command) {

  switch(command.action){

    case "add_stock":
      return addStock(command);

    case "remove_stock":
      return removeStock(command);

    case "create_product":
      return createProduct(command);

    case "list_products":
      return listProducts();

    case "inventory_value":
      return inventoryValue();

    case "view_product":
      return viewProduct(command);

    case "low_stock":
      return getLowStock();

    default:
      throw new Error("Unknown command");

  }

}

/* =====================================
COMMAND FUNCTIONS
===================================== */

async function addStock(cmd){

  let product = await Product.findOne({
    name:new RegExp(`^${cmd.product_name}$`,"i")
  });

  if(!product){

    product = await Product.create({
      name:cmd.product_name,
      price:cmd.price || 0,
      quantity:0
    });

  }

  const prev = product.quantity;

  product.quantity += cmd.quantity;

  await product.save();

  await Transaction.create({
    product:product._id,
    type:"add",
    quantity:cmd.quantity,
    previousQuantity:prev,
    newQuantity:product.quantity
  });

  return {
    response:`Added ${cmd.quantity} units to ${product.name}. Current stock: ${product.quantity}`,
    data:product
  };

}

async function removeStock(cmd){

  const product = await Product.findOne({
    name:new RegExp(`^${cmd.product_name}$`,"i")
  });

  if(!product) throw new Error(`Product ${cmd.product_name} not found`);

  const prev = product.quantity;

  product.quantity -= cmd.quantity;

  await product.save();

  await Transaction.create({
    product:product._id,
    type:"remove",
    quantity:cmd.quantity,
    previousQuantity:prev,
    newQuantity:product.quantity
  });

  return {
    response:`Removed ${cmd.quantity} from ${product.name}. Remaining: ${product.quantity}`
  };

}

async function createProduct(cmd){

  const existing = await Product.findOne({
    name:new RegExp(`^${cmd.product_name}$`,"i")
  });

  if(existing){
    throw new Error(`${existing.name} already exists`);
  }

  const product = await Product.create({
    name:cmd.product_name,
    price:cmd.price || 0,
    quantity:0
  });

  return {
    response:`Product ${product.name} created successfully`,
    data:product
  };

}

async function listProducts(){

  const products = await Product.find();

  const list = products
  .map(p=>`${p.name} — ${p.quantity} units`)
  .join("\n");

  return {
    response:`Products:\n${list}`,
    data:products
  };

}

async function inventoryValue(){

  const products = await Product.find();

  const total = products.reduce(
    (sum,p)=>sum+p.price*p.quantity,
    0
  );

  return {
    response:`Inventory value is ${formatINR(total)}`
  };

}

async function viewProduct(cmd){

  const product = await Product.findOne({
    name:new RegExp(`^${cmd.product_name}$`,"i")
  });

  if(!product){
    throw new Error(`Product ${cmd.product_name} not found`);
  }

  return {
    response:`You have ${product.quantity} ${product.name}s in stock`
  };

}
/* =====================================
CLEAR CHAT
===================================== */

exports.clearChat = async (req, res) => {

  const { sessionId } = req.body;

  clearContext(sessionId);

  res.json({
    message: "Chat cleared"
  });

};

async function getLowStock(){

  const products = await Product.find({
    $expr: { $lte: ["$quantity", "$minStockLevel"] }
  });

  if(!products.length){
    return{
      response:"All products are sufficiently stocked."
    };
  }

  const list = products
    .map(p => `${p.name} — ${p.quantity} units`)
    .join("\n");

  return{
    response:`Low stock items:\n${list}`,
    data:products
  };

}