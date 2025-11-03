import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import TaskList from './components/tasks/TaskList';
import TaskDetails from './components/tasks/TaskDetails';
import TaskForm from './components/tasks/TaskForm';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/" />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register /> : <Navigate to="/" />} 
          />
          <Route 
            path="/" 
            element={user ? <TaskList /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/tasks" 
            element={user ? <TaskList /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/tasks/new" 
            element={user ? <TaskForm /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/tasks/:id" 
            element={user ? <TaskDetails /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/tasks/:id/edit" 
            element={user ? <TaskForm /> : <Navigate to="/login" />} 
          />
        </Routes>
        <ToastContainer position="bottom-right" />
      </Layout>
    </Router>
  );
}

export default App;