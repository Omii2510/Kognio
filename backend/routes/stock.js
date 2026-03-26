const express = require('express');
const { addStock, removeStock, getLowStock, getStockValue } = require('../controllers/stockController');

const router = express.Router();

router.post('/add', addStock);
router.post('/remove', removeStock);
router.get('/low', getLowStock);
router.get('/value', getStockValue);

module.exports = router;
