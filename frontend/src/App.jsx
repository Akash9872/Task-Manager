import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import { useAuth } from './context/AuthContext';

function RootRedirect() {
  const { token, loading } = useAuth();
  const storedToken =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const isAuthed = Boolean(token || storedToken);
  if (loading) return <div className="loading">Loading...</div>;
  return <Navigate to={isAuthed ? '/dashboard' : '/login'} replace />;
}

function App() {

  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <main className="main-content container">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <PrivateRoute>
                  <ProjectsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <PrivateRoute>
                  <ProjectDetailPage />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<RootRedirect />} />
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  );
}

export default App;
