const Task = require('../models/Task');
const Project = require('../models/Project');

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    const projects = await Project.find({
      $or: [
        { admin: userId },
        { members: userId },
      ],
    });

    const projectIds = projects.map((project) => project._id);

    const tasks = await Task.find({ project: { $in: projectIds } })
      .populate('project assignedTo createdBy');

    const overdue = tasks.filter((task) =>
      task.dueDate && new Date(task.dueDate) < now && task.status !== 'Completed'
    );

    const upcoming = tasks.filter((task) =>
      task.dueDate && new Date(task.dueDate) >= now &&
      new Date(task.dueDate) <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) &&
      task.status !== 'Completed'
    );

    const assignedToUser = tasks.filter(
      (task) => task.assignedTo && task.assignedTo._id.toString() === userId
    );

    const unreadNotifications = [
      ...overdue.map((task) => ({
        type: 'overdue',
        message: `Task \"${task.title}\" is overdue in project ${task.project.name}`,
        taskId: task._id,
        projectId: task.project._id,
        date: task.dueDate,
      })),
      ...upcoming.map((task) => ({
        type: 'upcoming',
        message: `Task \"${task.title}\" is due soon in project ${task.project.name}`,
        taskId: task._id,
        projectId: task.project._id,
        date: task.dueDate,
      })),
    ];

    const assignmentUpdates = assignedToUser
      .filter((task) => task.assignedTo && task.assignedTo._id.toString() === userId)
      .map((task) => ({
        type: 'assigned',
        message: `You are assigned to task \"${task.title}\" in project ${task.project.name}`,
        taskId: task._id,
        projectId: task.project._id,
        date: task.dueDate || task.createdAt,
      }));

    res.json({
      notifications: [...assignmentUpdates, ...unreadNotifications].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      ),
      total: assignmentUpdates.length + unreadNotifications.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getNotifications };
