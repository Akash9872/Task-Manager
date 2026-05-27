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

    const completionRate = taskStats.total
      ? Math.round((taskStats.completed / taskStats.total) * 100)
      : 0;

    const priorityStats = {
      high: allTasks.filter((t) => t.priority === 'High').length,
      medium: allTasks.filter((t) => t.priority === 'Medium').length,
      low: allTasks.filter((t) => t.priority === 'Low').length,
    };

    const recentActivity = allTasks
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5)
      .map((task) => ({
        id: task._id,
        title: task.title,
        status: task.status,
        project: task.project.name,
        updatedAt: task.updatedAt,
      }));

    res.json({
      projectCount: projects.length,
      myTasks,
      taskStats,
      overdueTasks,
      upcomingTasks,
      recentProjects: projects.slice(0, 5),
      completionRate,
      priorityStats,
      recentActivity,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCalendar = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await Project.find({
      $or: [
        { admin: userId },
        { members: userId },
      ],
    });

    const projectIds = projects.map((project) => project._id);
    const tasks = await Task.find({
      project: { $in: projectIds },
      dueDate: { $exists: true },
    }).populate('project assignedTo');

    const calendarTasks = tasks
      .filter((task) => task.dueDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .map((task) => ({
        id: task._id,
        title: task.title,
        dueDate: task.dueDate,
        project: task.project.name,
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo ? task.assignedTo.name : null,
      }));

    res.json({ calendarTasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDashboard, getCalendar };
