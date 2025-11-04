import React, { useState } from 'react';
import { tasksAPI } from '../../services/api';
import { PRIORITY, PRIORITY_COLORS, PRIORITY_LABELS, STATUS_LABELS } from '../../utils/constants';

const PriorityBoard = ({ tasks, onTaskUpdate }) => {
  const [draggedTask, setDraggedTask] = useState(null);

  // Group tasks by priority
  const tasksByPriority = {
    [PRIORITY.HIGH]: tasks.filter(task => task.priority === PRIORITY.HIGH),
    [PRIORITY.MEDIUM]: tasks.filter(task => task.priority === PRIORITY.MEDIUM),
    [PRIORITY.LOW]: tasks.filter(task => task.priority === PRIORITY.LOW),
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, priority) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, newPriority) => {
    e.preventDefault();
    if (draggedTask && draggedTask.priority !== newPriority) {
      try {
        await tasksAPI.updatePriority(draggedTask._id, newPriority);
        onTaskUpdate(); // Refresh the tasks
      } catch (error) {
        console.error('Error updating priority:', error);
      }
    }
    setDraggedTask(null);
  };

  const handleStatusToggle = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
      await tasksAPI.updateStatus(taskId, newStatus);
      onTaskUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const PriorityColumn = ({ priority, tasks }) => (
    <div 
      className="priority-column"
      onDragOver={(e) => handleDragOver(e, priority)}
      onDrop={(e) => handleDrop(e, priority)}
    >
      <div 
        className="column-header"
        style={{ 
          backgroundColor: PRIORITY_COLORS[priority],
          color: 'white'
        }}
      >
        <h3>{PRIORITY_LABELS[priority]} Priority</h3>
        <span className="task-count">{tasks.length} tasks</span>
      </div>
      <div className="tasks-container">
        {tasks.map(task => (
          <div
            key={task._id}
            className="board-task-card"
            draggable
            onDragStart={(e) => handleDragStart(e, task)}
          >
            <div className="task-header">
              <h4>{task.title}</h4>
              <span className={`status-badge ${task.status}`}>
                {STATUS_LABELS[task.status]}
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
            </div>
            <div className="task-actions">
              <button
                onClick={() => handleStatusToggle(task._id, task.status)}
                className={`btn btn-sm ${
                  task.status === 'pending' ? 'btn-success' : 'btn-warning'
                }`}
              >
                {task.status === 'pending' ? '✓ Complete' : '↶ Pending'}
              </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="empty-column">
            <p>No tasks in this priority</p>
            <p className="drop-hint">Drag tasks here to assign {PRIORITY_LABELS[priority].toLowerCase()} priority</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="priority-board">
      <div className="board-header">
        <h2>Priority Board</h2>
        <p className="board-instructions">
          Drag and drop tasks between columns to change their priority
        </p>
      </div>
      <div className="board-columns">
        <PriorityColumn priority={PRIORITY.HIGH} tasks={tasksByPriority[PRIORITY.HIGH]} />
        <PriorityColumn priority={PRIORITY.MEDIUM} tasks={tasksByPriority[PRIORITY.MEDIUM]} />
        <PriorityColumn priority={PRIORITY.LOW} tasks={tasksByPriority[PRIORITY.LOW]} />
      </div>
    </div>
  );
};

export default PriorityBoard;