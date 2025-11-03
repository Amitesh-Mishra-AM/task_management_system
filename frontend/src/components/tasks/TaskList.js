import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tasksAPI } from '../../services/api';
import { PRIORITY_COLORS, PRIORITY_LABELS, STATUS_LABELS } from '../../utils/constants';
import Pagination from '../common/Pagination';
import PriorityBoard from '../common/PriorityBoard';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [view, setView] = useState('list'); // 'list' or 'board'

  const fetchTasks = async (page = 1) => {
    try {
      setLoading(true);
      const response = await tasksAPI.getTasks(page, 10);
      if (response.data.success) {
        setTasks(response.data.data);
        setTotalPages(response.data.pagination.pages);
        setCurrentPage(response.data.pagination.current);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handlePageChange = (page) => {
    fetchTasks(page);
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const response = await tasksAPI.updateStatus(taskId, newStatus);
      if (response.data.success) {
        // Update the task in the local state
        setTasks(tasks.map(task => 
          task._id === taskId ? response.data.data : task
        ));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await tasksAPI.deleteTask(taskId);
        if (response.data.success) {
          setTasks(tasks.filter(task => task._id !== taskId));
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="task-list-container">
      <div className="task-header">
        <h1>My Tasks</h1>
        <div className="view-controls">
          <button 
            className={`btn ${view === 'list' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setView('list')}
          >
            List View
          </button>
          <button 
            className={`btn ${view === 'board' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setView('board')}
          >
            Board View
          </button>
          <Link to="/tasks/new" className="btn btn-primary">
            Create New Task
          </Link>
        </div>
      </div>

      {view === 'list' ? (
        <>
          <div className="tasks-grid">
            {tasks.length === 0 ? (
              <div className="no-tasks">
                <p>No tasks found. <Link to="/tasks/new">Create your first task!</Link></p>
              </div>
            ) : (
              tasks.map(task => (
                <div key={task._id} className="task-card">
                  <div className="task-header">
                    <h3>
                      <Link to={`/tasks/${task._id}`}>{task.title}</Link>
                    </h3>
                    <span 
                      className="priority-badge"
                      style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
                    >
                      {PRIORITY_LABELS[task.priority]}
                    </span>
                  </div>
                  
                  <p className="task-description">
                    {task.description.length > 100 
                      ? `${task.description.substring(0, 100)}...` 
                      : task.description
                    }
                  </p>
                  
                  <div className="task-meta">
                    <span className="due-date">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                    <span className={`status ${task.status}`}>
                      {STATUS_LABELS[task.status]}
                    </span>
                  </div>

                  <div className="task-actions">
                    <button
                      onClick={() => handleStatusUpdate(
                        task._id, 
                        task.status === 'pending' ? 'completed' : 'pending'
                      )}
                      className={`btn btn-sm ${
                        task.status === 'pending' ? 'btn-success' : 'btn-warning'
                      }`}
                    >
                      {task.status === 'pending' ? 'Mark Complete' : 'Mark Pending'}
                    </button>
                    
                    <Link 
                      to={`/tasks/${task._id}/edit`} 
                      className="btn btn-sm btn-secondary"
                    >
                      Edit
                    </Link>
                    
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <PriorityBoard tasks={tasks} onTaskUpdate={fetchTasks} />
      )}
    </div>
  );
};

export default TaskList;