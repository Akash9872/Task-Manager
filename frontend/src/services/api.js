import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url || '';
    const isAuthAttempt =
      url.includes('/auth/login') || url.includes('/auth/signup');
    if (status === 401 && !isAuthAttempt) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        if (!path.startsWith('/login') && !path.startsWith('/signup')) {
          window.location.assign('/login');
        }
      }
    }
    return Promise.reject(err);
  }
);

export const authService = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

export const projectService = {
  createProject: (data) => api.post('/projects', data),
  getProjects: () => api.get('/projects'),
  getProjectById: (id) => api.get(`/projects/${id}`),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  addMember: (id, data) => api.post(`/projects/${id}/members`, data),
  removeMember: (id, data) =>
    api.delete(`/projects/${id}/members`, { data }),
  deleteProject: (id) => api.delete(`/projects/${id}`),
};

export const taskService = {
  createTask: (data) => api.post('/tasks', data),
  getProjectTasks: (projectId) => api.get(`/tasks/project/${projectId}`),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};

export const dashboardService = {
  getDashboard: () => api.get('/dashboard'),
};

export default api;
