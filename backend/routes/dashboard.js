const express = require('express');
const { getDashboard } = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, getDashboard);

module.exports = router;
