const Message = require('../models/Message');
const Project = require('../models/Project');

const userHasProjectAccess = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return false;
  if (project.admin.toString() === userId) return true;
  return project.members.some((m) => m.toString() === userId);
};

const getMessages = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const allowed = await userHasProjectAccess(projectId, userId);
    if (!allowed) {
      return res.status(403).json({ error: 'Not authorized for this project chat' });
    }

    const messages = await Message.find({ project: projectId })
      .populate('user', 'name email')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const allowed = await userHasProjectAccess(projectId, userId);
    if (!allowed) {
      return res.status(403).json({ error: 'Not authorized for this project chat' });
    }

    const message = new Message({ project: projectId, user: userId, content: content.trim() });
    await message.save();
    await message.populate('user', 'name email');

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getMessages, sendMessage };
