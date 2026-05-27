import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationService.getNotifications();
        setNotifications(response.data.notifications || []);
      } catch (err) {
        setError('Unable to load notifications.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleOpenProject = (projectId) => {
    if (projectId) {
      navigate(`/projects/${projectId}`);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Notifications</h1>
        <p className="text-muted">Stay on top of upcoming deadlines, assignments, and overdue work.</p>
      </div>

      {loading ? (
        <div className="loading">Loading notifications...</div>
      ) : (
        <>
          {error && <div className="alert alert-error">{error}</div>}
          {notifications.length === 0 ? (
            <div className="empty-state">
              <p>You have no notifications at the moment.</p>
            </div>
          ) : (
            <div className="task-list">
              {notifications.map((notification, index) => (
                <div key={index} className="task-item notification-item">
                  <div className="task-title">{notification.message}</div>
                  <div className="task-meta">
                    <span className="badge badge-secondary">{notification.type}</span>
                    <span className="text-muted">{new Date(notification.date).toLocaleString()}</span>
                  </div>
                  {notification.projectId && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm mt-2"
                      onClick={() => handleOpenProject(notification.projectId)}
                    >
                      Open project
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationsPage;
