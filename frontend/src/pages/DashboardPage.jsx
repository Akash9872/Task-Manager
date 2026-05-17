import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await dashboardService.getDashboard();
        setDashboard(response.data);
      } catch (err) {
        setError('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p className="text-muted">Here's what's happening with your projects</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {dashboard && (
        <>
          {/* Stats */}
          <div className="dashboard-stats grid grid-3">
            <div className="stat-card">
              <div className="stat-value">{dashboard.projectCount}</div>
              <div className="stat-label">Total Projects</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{dashboard.taskStats.total}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{dashboard.taskStats.completed}</div>
              <div className="stat-label">Completed Tasks</div>
            </div>
          </div>

          {/* Task Status Breakdown */}
          <div className="dashboard-section">
            <h2>Task Status</h2>
            <div className="task-status-cards grid grid-3">
              <div className="status-card pending">
                <div className="status-icon">📋</div>
                <div className="status-count">{dashboard.taskStats.pending}</div>
                <div className="status-name">Pending</div>
              </div>
              <div className="status-card progress">
                <div className="status-icon">⚙️</div>
                <div className="status-count">{dashboard.taskStats.inProgress}</div>
                <div className="status-name">In Progress</div>
              </div>
              <div className="status-card completed">
                <div className="status-icon">✅</div>
                <div className="status-count">{dashboard.taskStats.completed}</div>
                <div className="status-name">Completed</div>
              </div>
            </div>
          </div>

          {/* Overdue Tasks */}
          {dashboard.overdueTasks.length > 0 && (
            <div className="dashboard-section">
              <h2>⚠️ Overdue Tasks ({dashboard.overdueTasks.length})</h2>
              <div className="task-list">
                {dashboard.overdueTasks.slice(0, 5).map((task) => (
                  <div key={task._id} className="task-item overdue">
                    <div className="task-title">{task.title}</div>
                    <div className="task-meta">
                      <span className="badge badge-danger">Overdue</span>
                      <span className="text-muted">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Tasks */}
          {dashboard.upcomingTasks.length > 0 && (
            <div className="dashboard-section">
              <h2>📅 Upcoming Tasks ({dashboard.upcomingTasks.length})</h2>
              <div className="task-list">
                {dashboard.upcomingTasks.slice(0, 5).map((task) => (
                  <div key={task._id} className="task-item">
                    <div className="task-title">{task.title}</div>
                    <div className="task-meta">
                      <span className={`badge badge-${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                      <span className="text-muted">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Tasks */}
          {dashboard.myTasks.length > 0 && (
            <div className="dashboard-section">
              <h2>My Tasks ({dashboard.myTasks.length})</h2>
              <div className="task-list">
                {dashboard.myTasks.slice(0, 5).map((task) => (
                  <div key={task._id} className="task-item">
                    <div className="task-title">{task.title}</div>
                    <div className="task-meta">
                      <span className={`badge badge-${task.status.toLowerCase().replace(' ', '-')}`}>
                        {task.status}
                      </span>
                      <span className="text-muted">{task.project.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
