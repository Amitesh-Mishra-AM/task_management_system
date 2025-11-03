import React from 'react';
import { Link } from 'react-router-dom';
import { PRIORITY_COLORS, PRIORITY_LABELS, STATUS_LABELS } from '../../utils/constants';

const TaskItem = ({ task, onStatusUpdate, onDelete }) => {
  const handleStatusToggle = () => {
    onStatusUpdate(task._id, task.status === 'pending' ? 'completed' : 'pending');
  };

  const handleDelete = () => {
    onDelete(task._id);
  };

  return (
    <div className={`task-item ${task.status}`}>
      <div className="task-content">
        <div className="task-header">
          <h4>
            <Link to={`/tasks/${task._id}`}>{task.title}</Link>
          </h4>
          <span 
            className="priority-badge"
            style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
          >
            {PRIORITY_LABELS[task.priority]}
          </span>
        </div>
        
        <p className="task-description">
          {task.description.length > 150 
            ? `${task.description.substring(0, 150)}...` 
            : task.description
          }
        </p>
        
        <div className="task-meta">
          <span className="due-date">
            <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
          </span>
          <span className={`status ${task.status}`}>
            {STATUS_LABELS[task.status]}
          </span>
        </div>
      </div>

      <div className="task-actions">
        <button
          onClick={handleStatusToggle}
          className={`btn btn-sm ${task.status === 'pending' ? 'btn-success' : 'btn-warning'}`}
        >
          {task.status === 'pending' ? 'Complete' : 'Pending'}
        </button>
        
        <Link 
          to={`/tasks/${task._id}/edit`} 
          className="btn btn-sm btn-secondary"
        >
          Edit
        </Link>
        
        <button
          onClick={handleDelete}
          className="btn btn-sm btn-danger"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;