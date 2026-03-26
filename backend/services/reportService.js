const Groq = require('groq-sdk');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.generateReport = async () => {
  try {

    const products = await Product.find();
    const transactions = await Transaction.find().sort('-createdAt');

    if (products.length === 0) {
      return {
        report: "No inventory data available.",
        data: {},
        generatedAt: new Date()
      };
    }

    /* BASIC STATS */

    const totalProducts = products.length;

    const totalValue = products.reduce(
      (sum,p)=>sum + p.quantity * p.price,0
    );

    const lowStock = products.filter(
      p => p.quantity <= p.minStockLevel
    );

    const outOfStock = products.filter(
      p => p.quantity === 0
    );

    /* DEAD STOCK (no movement in 30 days) */

    const last30Days = new Date(
      Date.now() - 30*24*60*60*1000
    );

    const recentTransactions = transactions.filter(
      t => new Date(t.createdAt) > last30Days
    );

    const movedProductIds = new Set(
      recentTransactions.map(t=>String(t.product))
    );

    const deadStock = products.filter(
      p => !movedProductIds.has(String(p._id))
    );

    /* FAST MOVING PRODUCTS */

    const productMovement = {};

    recentTransactions.forEach(t=>{
      const id = String(t.product);
      if(!productMovement[id]) productMovement[id] = 0;
      productMovement[id] += t.quantity;
    });

    const fastMoving = products
      .map(p=>({
        name:p.name,
        movement:productMovement[String(p._id)] || 0
      }))
      .sort((a,b)=>b.movement-a.movement)
      .slice(0,5);

    /* OVERSTOCK */

    const overStock = products.filter(
      p => p.quantity > p.minStockLevel * 5
    );

    /* REPORT DATA */

    const reportData = {

      summary:{
        totalProducts,
        totalValue,
        lowStockCount:lowStock.length,
        outOfStockCount:outOfStock.length,
        deadStockCount:deadStock.length
      },

      fastMoving,

      deadStock:deadStock.map(p=>({
        name:p.name,
        quantity:p.quantity
      })),

      overStock:overStock.map(p=>({
        name:p.name,
        quantity:p.quantity
      })),

      lowStockProducts:lowStock.map(p=>({
        name:p.name,
        quantity:p.quantity,
        min:p.minStockLevel
      }))

    };

    /* AI REPORT PROMPT */

    const prompt = `
You are an expert inventory analyst.

Generate a professional business inventory report.

Data:

${JSON.stringify(reportData,null,2)}

Include:

Executive summary
Inventory health score
Dead stock analysis
Overstock risk
Fast moving products
Operational risks
Recommendations
Future predictions

Use INR currency.
`;

    const response = await groq.chat.completions.create({
      model:'llama-3.3-70b-versatile',
      messages:[{role:'user',content:prompt}],
      temperature:0.6,
      max_tokens:3000
    });

    return{
      report:response.choices[0].message.content,
      data:reportData,
      generatedAt:new Date()
    };

  } catch(err){

    console.error(err);

    throw new Error("Failed to generate report");

  }
};