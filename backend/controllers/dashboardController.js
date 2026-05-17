const Task = require('../models/Task');
const Project = require('../models/Project');

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get projects where user is member or admin
    const projects = await Project.find({
      $or: [
        { admin: userId },
        { members: userId }
      ]
    }).populate('admin members');

    const projectIds = projects.map(p => p._id);

    // Get all tasks in user's projects
    const allTasks = await Task.find({ project: { $in: projectIds } })
      .populate('project assignedTo createdBy');

    // Get tasks assigned to user
    const myTasks = allTasks.filter(t => t.assignedTo && t.assignedTo._id.toString() === userId);

    // Count tasks by status
    const taskStats = {
      pending: allTasks.filter(t => t.status === 'Pending').length,
      inProgress: allTasks.filter(t => t.status === 'In Progress').length,
      completed: allTasks.filter(t => t.status === 'Completed').length,
      total: allTasks.length,
    };

    // Get overdue tasks
    const now = new Date();
    const overdueTasks = allTasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < now && t.status !== 'Completed'
    );

    // Get upcoming tasks (due within 7 days)
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingTasks = allTasks.filter(t => 
      t.dueDate && new Date(t.dueDate) <= sevenDaysFromNow && 
      new Date(t.dueDate) >= now && t.status !== 'Completed'
    );

    res.json({
      projectCount: projects.length,
      myTasks,
      taskStats,
      overdueTasks,
      upcomingTasks,
      recentProjects: projects.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDashboard };
