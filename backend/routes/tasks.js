const express = require('express');
const { 
  createTask, 
  getProjectTasks, 
  updateTask, 
  deleteTask 
} = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, createTask);
router.get('/project/:projectId', authenticateToken, getProjectTasks);
router.put('/:id', authenticateToken, updateTask);
router.delete('/:id', authenticateToken, deleteTask);

module.exports = router;
