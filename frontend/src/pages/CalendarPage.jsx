import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';
import '../styles/calendar.css';

const CalendarPage = () => {
  const [calendarTasks, setCalendarTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCalendar = async () => {
      try {
        const response = await dashboardService.getCalendar();
        setCalendarTasks(response.data.calendarTasks);
      } catch (err) {
        setError('Failed to load calendar tasks');
      } finally {
        setLoading(false);
      }
    };
    loadCalendar();
  }, []);

  const grouped = calendarTasks.reduce((acc, task) => {
    const dateKey = new Date(task.dueDate).toLocaleDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(task);
    return acc;
  }, {});

  if (loading) return <div className="loading">Loading calendar...</div>;

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <h1>Task Calendar</h1>
        <p className="text-muted">See scheduled due dates across your active projects.</p>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {calendarTasks.length === 0 ? (
        <div className="empty-state">
          <p>No scheduled tasks yet. Add due dates to your tasks to see them here.</p>
        </div>
      ) : (
        <div className="calendar-grid">
          {Object.entries(grouped).map(([date, tasks]) => (
            <div key={date} className="calendar-day-card">
              <div className="calendar-day-header">
                <h3>{date}</h3>
                <span>{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
              </div>
              <ul className="calendar-task-list">
                {tasks.map((task) => (
                  <li key={task.id} className={`calendar-task ${task.status.toLowerCase().replace(' ', '-')}`}>
                    <div className="calendar-task-title">{task.title}</div>
                    <div className="calendar-task-meta">
                      <span>{task.project}</span>
                      <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
