const express = require('express');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  addMember,
  removeMember,
  deleteProject,
} = require('../controllers/projectController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, createProject);
router.get('/', authenticateToken, getProjects);
router.get('/:id', authenticateToken, getProjectById);
router.put('/:id', authenticateToken, updateProject);
router.post('/:id/members', authenticateToken, addMember);
router.delete('/:id/members', authenticateToken, removeMember);
router.delete('/:id', authenticateToken, deleteProject);

module.exports = router;
