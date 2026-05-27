const express = require('express');
const multer = require('multer');
const path = require('path');
const { 
  createTask, 
  getProjectTasks, 
  updateTask, 
  deleteTask,
  uploadTaskAttachment,
  getTaskAttachments,
} = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    cb(null, safeName);
  },
});

const upload = multer({ storage });

router.post('/', authenticateToken, createTask);
router.get('/project/:projectId', authenticateToken, getProjectTasks);
router.put('/:id', authenticateToken, updateTask);
router.delete('/:id', authenticateToken, deleteTask);
router.post('/:id/attachments', authenticateToken, upload.single('file'), uploadTaskAttachment);
router.get('/:id/attachments', authenticateToken, getTaskAttachments);

module.exports = router;
