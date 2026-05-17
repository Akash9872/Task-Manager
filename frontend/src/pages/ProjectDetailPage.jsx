import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService, taskService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/project-detail.css';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    assignedToEmail: '',
  });
  const [memberEmail, setMemberEmail] = useState('');
  const [memberLoading, setMemberLoading] = useState(false);

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        projectService.getProjectById(id),
        taskService.getProjectTasks(id),
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
      setError('');
    } catch (err) {
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title) {
      setError('Task title is required');
      return;
    }

    try {
      await taskService.createTask({
        ...taskForm,
        projectId: id,
      });
      setTaskForm({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
        assignedToEmail: '',
      });
      setShowTaskForm(false);
      fetchProjectData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      fetchProjectData();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberEmail.trim()) {
      setError('Member email is required');
      return;
    }
    setMemberLoading(true);
    setError('');
    try {
      await projectService.addMember(id, { memberEmail: memberEmail.trim() });
      setMemberEmail('');
      fetchProjectData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add member');
    } finally {
      setMemberLoading(false);
    }
  };

  const handleRemoveMember = async (email) => {
    if (!window.confirm(`Remove ${email} from this project?`)) return;
    setError('');
    try {
      await projectService.removeMember(id, { memberEmail: email });
      fetchProjectData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove member');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskService.deleteTask(taskId);
      fetchProjectData();
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const isAdmin =
    project &&
    String(project.admin._id ?? project.admin) === String(user?.id);

  if (loading) return <div className="loading">Loading project...</div>;
  if (!project) return <div className="error">Project not found</div>;

  const tasksByStatus = {
    Pending: tasks.filter(t => t.status === 'Pending'),
    'In Progress': tasks.filter(t => t.status === 'In Progress'),
    Completed: tasks.filter(t => t.status === 'Completed'),
  };

  return (
    <div className="project-detail-container">
      <button className="btn btn-secondary" onClick={() => navigate('/projects')}>
        ← Back to Projects
      </button>

      <div className="project-header">
        <div>
          <h1>{project.name}</h1>
          <p className="text-muted">{project.description}</p>
        </div>
        {isAdmin && (
          <button className="btn btn-danger btn-sm" onClick={() => {
            if (window.confirm('Delete this project?')) {
              projectService.deleteProject(id).then(() => navigate('/projects'));
            }
          }}>
            Delete Project
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="project-info">
        <div className="info-item">
          <span className="label">Admin</span>
          <span>{project.admin.name}</span>
        </div>
        <div className="info-item">
          <span className="label">Members</span>
          <span>{project.members.length}</span>
        </div>
        <div className="info-item">
          <span className="label">Total Tasks</span>
          <span>{tasks.length}</span>
        </div>
      </div>

      {isAdmin && (
        <div className="members-section">
          <h3>Team members</h3>
          <ul className="members-list">
            {project.members.map((m) => (
              <li key={m._id} className="member-row flex-between">
                <span>
                  {m.name} <span className="text-muted">({m.email})</span>
                  {String(m._id) === String(project.admin._id ?? project.admin) && (
                    <span className="badge badge-primary"> Admin</span>
                  )}
                </span>
                {String(m._id) !== String(project.admin._id ?? project.admin) && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleRemoveMember(m.email)}
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
          <h4 className="mt-2">Add team member</h4>
          <form onSubmit={handleAddMember} className="add-member-form">
            <input
              type="email"
              placeholder="member@example.com"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              disabled={memberLoading}
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={memberLoading}
            >
              {memberLoading ? 'Adding…' : 'Add Member'}
            </button>
          </form>
        </div>
      )}

      {!isAdmin && project.members?.length > 0 && (
        <div className="members-section">
          <h3>Team members</h3>
          <ul className="members-list">
            {project.members.map((m) => (
              <li key={m._id}>
                {m.name}{' '}
                <span className="text-muted">({m.email})</span>
                {String(m._id) === String(project.admin._id ?? project.admin) && (
                  <span className="badge badge-primary"> Admin</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="tasks-section">
        <div className="flex-between">
          <h2>Tasks</h2>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowTaskForm(!showTaskForm)}
          >
            + New Task
          </button>
        </div>

        {showTaskForm && (
          <form onSubmit={handleCreateTask} className="card task-form">
            <div className="form-group">
              <label>Task Title</label>
              <input
                type="text"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                placeholder="Enter task title"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                placeholder="Enter task description"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Assign to Member (email)</label>
              <input
                type="email"
                value={taskForm.assignedToEmail}
                onChange={(e) => setTaskForm({ ...taskForm, assignedToEmail: e.target.value })}
                placeholder="member@example.com"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary">Create Task</button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowTaskForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="tasks-kanban grid grid-3">
          {['Pending', 'In Progress', 'Completed'].map((status) => (
            <div key={status} className="kanban-column">
              <h4 className="column-header">{status}</h4>
              <div className="task-cards">
                {tasksByStatus[status].map((task) => (
                  <div key={task._id} className={`task-card ${status.toLowerCase().replace(' ', '-')}`}>
                    <div className="task-header">
                      <h5>{task.title}</h5>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteTask(task._id)}
                        title="Delete task"
                      >
                        ✕
                      </button>
                    </div>
                    {task.description && (
                      <p className="task-description">{task.description}</p>
                    )}
                    <div className="task-badges">
                      <span className={`badge badge-${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                      {task.assignedTo && (
                        <span className="badge badge-primary">
                          {task.assignedTo.name}
                        </span>
                      )}
                    </div>
                    {task.dueDate && (
                      <div className="task-due-date text-muted text-sm">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                    <div className="task-actions mt-2">
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                        className="status-select"
                      >
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
