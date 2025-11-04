import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { tasksAPI } from '../../services/api';
import { PRIORITY_COLORS, PRIORITY_LABELS, STATUS_LABELS } from '../../utils/constants';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await tasksAPI.getTask(id);
      if (response.data.success) {
        setTask(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching task:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await tasksAPI.updateStatus(id, newStatus);
      if (response.data.success) {
        setTask(response.data.data);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handlePriorityUpdate = async (newPriority) => {
    try {
      const response = await tasksAPI.updatePriority(id, newPriority);
      if (response.data.success) {
        setTask(response.data.data);
      }
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      try {
        const response = await tasksAPI.deleteTask(id);
        if (response.data.success) {
          navigate('/');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };
  if (loading) {
    return <div className="loading">Loading task details...</div>;
  }

  if (!task) {
    return (
      <div className="error-container">
        <h2>Task Not Found</h2>
        <p>The task you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">Back to Tasks</Link>
      </div>
    );
  }

  return (
    <div className="task-details">
      <div className="task-header">
        <div className="back-link">
          <Link to="/" className="btn btn-secondary">&larr; Back to Tasks</Link>
        </div>
        <div className="task-actions">
          <button
            onClick={() => handleStatusUpdate(
              task.status === 'pending' ? 'completed' : 'pending'
            )}
            className={`btn ${task.status === 'pending' ? 'btn-success':'btn-warning'}`}
          >
            {task.status === 'pending' ? 'Mark Complete' : 'Mark Pending'}
          </button>
          <Link to={`/tasks/${task._id}/edit`} className="btn btn-secondary">
            Edit Task
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete Task
          </button>
        </div>
      </div>

      <div className="task-content">
        <div className="task-meta">
          <span 
            className="priority-badge large"
            style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
          >
            {PRIORITY_LABELS[task.priority]} Priority
          </span>
          <span className={`status-badge large ${task.status}`}>
            {STATUS_LABELS[task.status]}
          </span>
          <span className="due-date large">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </div>
        <h1>{task.title}</h1>
        
        <div className="description-section">
          <h3>Description</h3>
          <p className="task-description">{task.description}</p>
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <label>Update Priority:</label>
            <div className="priority-buttons">
              {['low', 'medium', 'high'].map(priority => (
                <button
                  key={priority}
                  onClick={() => handlePriorityUpdate(priority)}
                  disabled={task.priority === priority}
                  className={`btn btn-sm ${
                    task.priority === priority ? 'active' : ''
                  }`}
                  style={{
                    backgroundColor: task.priority === priority 
                      ? PRIORITY_COLORS[priority] 
                      : '#f8f9fa',
                    color: task.priority === priority ? 'white' : '#333'
                  }}
                >
                  {PRIORITY_LABELS[priority]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="task-info">
          <h3>Task Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Created:</strong>
              <span>{new Date(task.createdAt).toLocaleString()}</span>
            </div>
            <div className="info-item">
              <strong>Last Updated:</strong>
              <span>{new Date(task.updatedAt).toLocaleString()}</span>
            </div>
            <div className="info-item">
              <strong>Due Date:</strong>
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <strong>Status:</strong>
              <span className={`status ${task.status}`}>
                {STATUS_LABELS[task.status]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;