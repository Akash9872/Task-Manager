const Task = require('../models/Task');
const Project = require('../models/Project');

const userHasProjectAccess = (project, userId) => {
  const uid = String(userId);
  if (project.admin.toString() === uid) return true;
  return project.members.some((m) => m.toString() === uid);
};

const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedToEmail, priority, dueDate } = req.body;
    const userId = req.user.id;

    if (!title || !projectId) {
      return res.status(400).json({ error: 'Title and project ID are required' });
    }

    // Check if user is part of the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!userHasProjectAccess(project, userId)) {
      return res.status(403).json({ error: 'Not authorized to create task in this project' });
    }

    let assignedTo = null;
    if (assignedToEmail) {
      const User = require('../models/User');
      const assignedUser = await User.findOne({ email: assignedToEmail });
      if (
        assignedUser &&
        project.members.some((m) => m.toString() === assignedUser._id.toString())
      ) {
        assignedTo = assignedUser._id;
      }
    }

    const task = new Task({
      title,
      description,
      project: projectId,
      assignedTo,
      createdBy: userId,
      priority: priority || 'Medium',
      dueDate,
    });

    await task.save();
    await task.populate('project assignedTo createdBy');

    res.status(201).json({ 
      message: 'Task created successfully',
      task 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!userHasProjectAccess(project, userId)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const tasks = await Task.find({ project: projectId })
      .populate('project assignedTo createdBy');

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedToEmail, priority, dueDate } = req.body;
    const userId = req.user.id;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user is authorized
    const project = await Project.findById(task.project);
    if (!userHasProjectAccess(project, userId)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;

    if (assignedToEmail) {
      const User = require('../models/User');
      const assignedUser = await User.findOne({ email: assignedToEmail });
      if (
        assignedUser &&
        project.members.some((m) => m.toString() === assignedUser._id.toString())
      ) {
        task.assignedTo = assignedUser._id;
      }
    }

    task.updatedAt = Date.now();
    await task.save();
    await task.populate('project assignedTo createdBy');

    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    const isCreator = task.createdBy.toString() === userId;
    const isProjectAdmin =
      project && project.admin.toString() === userId;

    if (!isCreator && !isProjectAdmin) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Task.findByIdAndDelete(id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { 
  createTask, 
  getProjectTasks, 
  updateTask, 
  deleteTask 
};
