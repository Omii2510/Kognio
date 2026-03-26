const express = require('express');
const { processVoiceCommand } = require('../controllers/nlpController');

const router = express.Router();

router.post('/process-command', processVoiceCommand);

module.exports = router;
