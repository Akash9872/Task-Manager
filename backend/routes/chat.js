const express = require('express');
const { getMessages, sendMessage } = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/:projectId/messages', authenticateToken, getMessages);
router.post('/:projectId/messages', authenticateToken, sendMessage);

module.exports = router;
