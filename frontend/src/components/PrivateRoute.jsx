import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();
  const storedToken =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const isAuthed = Boolean(token || storedToken);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return isAuthed ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
