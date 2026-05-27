const express = require('express');
const { getDashboard, getCalendar } = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, getDashboard);
router.get('/calendar', authenticateToken, getCalendar);

module.exports = router;
