const express = require('express');
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const { getAlerts, dismissAlert } = require('../services/alertService');
const { generateReport } = require('../services/reportService');

const router = express.Router();

router.get('/dashboard', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const lowStockCount = await Product.countDocuments({ $expr: { $lte: ['$quantity', '$minStockLevel'] } });

    const stockValue = await Product.aggregate([
      { $group: { _id: null, total: { $sum: { $multiply: ['$quantity', '$price'] } } } }
    ]);

    const recentTransactions = await Transaction.find()
      .sort('-createdAt')
      .limit(10)
      .populate('product user');

    res.json({
      totalProducts,
      lowStockCount,
      stockValue: stockValue[0]?.total || 0,
      recentTransactions
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/generate', async (req, res) => {
  try {
    const report = await generateReport();
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/transactions', async (req, res) => {

  try {

    const { productId, startDate, endDate } = req.query;

    const query = {};

    if (productId) query.product = productId;

    if (startDate || endDate) {

      query.createdAt = {};

      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);

    }

    const transactions = await Transaction.find(query)
      .sort('-createdAt')
      .populate('product user');

    res.json(transactions);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});

router.get('/alerts', async (req, res) => {

  try {

    const alerts = await getAlerts();

    res.json(alerts);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});

router.put('/alerts/:id/dismiss', async (req, res) => {

  try {

    await dismissAlert(req.params.id);

    res.json({ message: 'Alert dismissed' });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});

router.get('/analytics', async (req,res)=>{

  try{

    const products = await Product.find();
    const transactions = await Transaction.find();

    const totalValue = products.reduce((s,p)=>s+p.price*p.quantity,0);

    const lowStock = products.filter(p=>p.quantity <= p.minStockLevel);

    const deadStock = products.filter(p=>{
      return !transactions.some(t=>String(t.product) === String(p._id));
    });

    res.json({
      totalProducts:products.length,
      totalValue,
      lowStock:lowStock.length,
      deadStock:deadStock.length
    });

  }catch(err){
    res.status(500).json({message:err.message});
  }

});


/* NEW ADVANCED ANALYTICS */

router.get('/advanced-analytics', async (req,res)=>{

  try{

    const products = await Product.find();
    const transactions = await Transaction.find();

    const productMovement = {};

    transactions.forEach(t=>{
      const id = String(t.product);
      if(!productMovement[id]) productMovement[id]=0;
      productMovement[id]+=t.quantity;
    });

    const fastMoving = products
      .map(p=>({
        name:p.name,
        movement:productMovement[String(p._id)] || 0
      }))
      .sort((a,b)=>b.movement-a.movement)
      .slice(0,5);

    const deadStock = products.filter(p=>{
      return !transactions.some(t=>String(t.product)===String(p._id));
    });

    const healthScore = Math.max(
      0,
      100 - deadStock.length * 5
    );

    res.json({
      fastMoving,
      deadStock:deadStock.map(p=>({
        name:p.name,
        quantity:p.quantity
      })),
      healthScore
    });

  }catch(err){
    res.status(500).json({message:err.message});
  }

});


module.exports = router;