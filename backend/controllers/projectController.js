const Project = require('../models/Project');
const User = require('../models/User');

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const project = new Project({
      name,
      description,
      admin: userId,
      members: [userId],
    });

    await project.save();
    await project.populate('admin members');

    res.status(201).json({ 
      message: 'Project created successfully',
      project 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await Project.find({
      $or: [
        { admin: userId },
        { members: userId }
      ]
    }).populate('admin members');

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const project = await Project.findById(id).populate('admin members');
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const adminId =
      project.admin && project.admin._id
        ? project.admin._id.toString()
        : project.admin.toString();
    const isMember = project.members.some((m) => {
      const mid = m._id ? m._id.toString() : m.toString();
      return mid === userId;
    });

    if (adminId !== userId && !isMember) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user.id;

    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only admin can update
    if (project.admin.toString() !== userId) {
      return res.status(403).json({ error: 'Only project admin can update' });
    }

    project.name = name || project.name;
    project.description = description || project.description;
    project.updatedAt = Date.now();

    await project.save();
    await project.populate('admin members');

    res.json({ message: 'Project updated successfully', project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberEmail } = req.body;
    const userId = req.user.id;

    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only admin can add members
    if (project.admin.toString() !== userId) {
      return res.status(403).json({ error: 'Only project admin can add members' });
    }

    const member = await User.findOne({ email: memberEmail });
    if (!member) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (project.members.includes(member._id)) {
      return res.status(400).json({ error: 'User is already a member' });
    }

    project.members.push(member._id);
    await project.save();
    await project.populate('admin members');

    res.json({ message: 'Member added successfully', project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberEmail } = req.body;
    const userId = req.user.id;

    if (!memberEmail) {
      return res.status(400).json({ error: 'Member email is required' });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.admin.toString() !== userId) {
      return res.status(403).json({ error: 'Only project admin can remove members' });
    }

    const member = await User.findOne({ email: memberEmail });
    if (!member) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (member._id.toString() === project.admin.toString()) {
      return res.status(400).json({ error: 'Cannot remove the project admin' });
    }

    project.members = project.members.filter((m) => m.toString() !== member._id.toString());
    await project.save();
    await project.populate('admin members');

    res.json({ message: 'Member removed successfully', project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only admin can delete
    if (project.admin.toString() !== userId) {
      return res.status(403).json({ error: 'Only project admin can delete' });
    }

    await Project.findByIdAndDelete(id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  addMember,
  removeMember,
  deleteProject,
};
