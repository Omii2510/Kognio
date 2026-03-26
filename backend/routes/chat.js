const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chatController");

// AI chat
router.post("/chat", chatController.chatWithAI);

// clear chat history
router.post("/clear", chatController.clearChat);

module.exports = router;