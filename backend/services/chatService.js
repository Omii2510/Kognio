const Groq = require("groq-sdk");
const Product = require("../models/Product");
const {
  getSessionState,
  setSessionState,
  clearSessionState
} = require("./sessionStateService");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/* =====================================
GLOBAL CONSTANTS
===================================== */

const CANCEL_WORDS = [
  "cancel",
  "stop",
  "never mind",
  "leave it",
  "don't do",
  "dont do",
  "abort"
];

const CONNECTORS = /\band\b|,|&|\bthen\b|और|और फिर|और उसके बाद/i;

/* =====================================
UTILITY FUNCTIONS
===================================== */

function isCancelCommand(text) {

  text = text.toLowerCase();

  return CANCEL_WORDS.some(w => text.includes(w));
}

function looksLikeSentence(text){

  if(!text) return false;

  if(text.length > 40) return true;

  if(text.split(" ").length > 5) return true;

  return false;
}

function validateIntent(intent){

  if(!intent) return false;

  const allowedActions = [
    "add_stock",
    "remove_stock",
    "create_product",
    "list_products",
    "inventory_value",
    "view_product",
    "low_stock",
    "update_product",
    "delete_product"
  ];

  if(!allowedActions.includes(intent.action)){
    return false;
  }

  if(intent.quantity && isNaN(intent.quantity)){
    return false;
  }

  if(intent.price && isNaN(intent.price)){
    return false;
  }

  return true;
}

/* =====================================
AI INTENT PARSER
===================================== */

async function parseIntent(message, inventorySummary) {

const systemPrompt = `
You are an AI inventory assistant.

Convert user messages into JSON commands.

Supported actions:

add_stock
remove_stock
create_product
list_products
inventory_value
view_product
low_stock

Return ONLY JSON.

Examples:

User: add 10 laptops
{
"action":"add_stock",
"product_name":"laptop",
"quantity":10
}

User: add 100 books for 2000
{
"action":"add_stock",
"product_name":"books",
"quantity":100,
"price":2000
}

User: create product gpu price 30000
{
"action":"create_product",
"product_name":"gpu",
"price":30000
}

User: how many laptops do I have
{
"action":"view_product",
"product_name":"laptop"
}

User: show inventory
{
"action":"list_products"
}

User: show low stock items
{
"action":"low_stock"
}

User: make mango price 500
{
"action":"update_product",
"product_name":"mango",
"price":500
}

User: update laptop price to 999
{
"action":"update_product",
"product_name":"laptop",
"price":999
}

User: change shampoo price to 200
{
"action":"update_product",
"product_name":"shampoo",
"price":200
}

User: delete product chair
{
"action":"delete_product",
"product_name":"chair"
}

User: what's my inventory value
{
"action":"inventory_value"
}

Languages supported:
English
Hindi
Marathi
Tamil
Telugu
Kannada
Gujarati
Punjabi
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.1,
    messages: [
      {
        role: "system",
        content: systemPrompt + "\nInventory:" + inventorySummary
      },
      {
        role: "user",
        content: message
      }
    ]
  });

  let text = response.choices[0].message.content.trim();

  if (text.includes("```")) {
    text = text.replace(/```json|```/g, "").trim();
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/* =====================================
MULTI COMMAND SPLITTER
===================================== */

function splitCommands(message) {

  const parts = message
    .toLowerCase()
    .split(CONNECTORS)
    .map(p => p.trim())
    .filter(Boolean);

  if (parts.length <= 1) return null;

  return parts;
}

/* =====================================
MAIN CHAT ENGINE
===================================== */

exports.chat = async (message, sessionId="default") => {

  message = message.trim();

  if(isCancelCommand(message)){

    clearSessionState(sessionId);

    return{
      type:"conversation",
      response:"✅ Okay, I cancelled the current task. How can I help you now?"
    }

  }

  if (/^hi|hello|hey|namaste/i.test(message)) {

    return {
      type: "conversation",
      response:
`👋 Hello! I'm your AI Inventory Assistant.

I can help you:

• Add stock
• Remove stock
• Create products
• Show inventory
• Check stock value
• Show low stock items

Examples:
add 10 laptops
create product gpu price 30000
show inventory
show low stock items`
    };

  }

  const state = getSessionState(sessionId);

  if (state) {

    if (state.action === "create_product") {

      if (!state.product_name) {

        if(looksLikeSentence(message)){

          return{
            type:"conversation",
            response:"That doesn't look like a product name. Please enter a simple product name."
          }

        }

        state.product_name = message.trim();
        setSessionState(sessionId, state);

        return {
          type: "conversation",
          response: "What is the price of the product?"
        };

      }

      if (!state.price) {

        const price = parseFloat(message);

        if(isNaN(price)){

          return{
            type:"conversation",
            response:"Please enter a valid numeric price."
          }

        }

        clearSessionState(sessionId);

        return {
          type: "command",
          action: "create_product",
          product_name: state.product_name,
          price
        };

      }

    }

  }

  /* =====================================
  MULTI COMMAND SUPPORT
  ===================================== */

  const parts = splitCommands(message);

  if (parts) {

    const commands = [];

    const products = await Product.find().limit(10);
    const summary = products.map(p => `${p.name}:${p.quantity}`).join(",");

    for (const p of parts) {

      const intent = await parseIntent(p, summary);

      if (validateIntent(intent)) {

        commands.push({
          type: "command",
          ...intent
        });

      }

    }

    if (commands.length >= 2) {   // ✅ FIXED
      return {
        type:"batch_command",
        commands
      };
    }

  }

  const products = await Product.find().limit(10);
  const summary = products.map(p => `${p.name}:${p.quantity}`).join(",");

  const intent = await parseIntent(message, summary);

  if (!validateIntent(intent)) {

    return {
      type:"conversation",
      response:
"Sorry, I couldn't understand that command.\n\nTry something like:\n• add 10 laptops\n• show inventory\n• show low stock items\n• create product gpu price 30000"
    };

  }

  if (intent.action === "create_product" && !intent.product_name) {

    setSessionState(sessionId,{
      action:"create_product"
    });

    return {
      type:"conversation",
      response:"What is the product name?"
    };

  }

  return {
    type:"command",
    ...intent
  };

};

exports.clearContext = (sessionId="default") => {
  clearSessionState(sessionId);
};