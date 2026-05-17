import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/api';
import '../styles/projects.css';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectService.getProjects();
      setProjects(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setError('Project name is required');
      return;
    }

    try {
      await projectService.createProject(formData);
      setFormData({ name: '', description: '' });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create project');
    }
  };

  if (loading) return <div className="loading">Loading projects...</div>;

  return (
    <div className="projects-container">
      <div className="projects-header flex-between">
        <div>
          <h1>Projects</h1>
          <p className="text-muted">Manage and organize your team projects</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          + New Project
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <form onSubmit={handleCreateProject} className="card create-form">
          <h3>Create New Project</h3>
          <div className="form-group">
            <label>Project Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter project name"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter project description"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary">Create</button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {projects.length === 0 ? (
        <div className="empty-state">
          <p>No projects yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="projects-grid grid grid-2">
          {projects.map((project) => (
            <div
              key={project._id}
              className="project-card card"
              onClick={() => navigate(`/projects/${project._id}`)}
              style={{ cursor: 'pointer' }}
            >
              <h3>{project.name}</h3>
              <p className="text-muted">{project.description}</p>
              <div className="project-meta">
                <span className="badge badge-primary">
                  {project.members.length} members
                </span>
                <span className="text-muted text-sm">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
