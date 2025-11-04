import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tasksAPI } from '../../services/api';
import { PRIORITY_LABELS, PRIORITY_COLORS } from '../../utils/constants'; // ✅ Added this

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await tasksAPI.getTask(id);
      if (response.data.success) {
        const task = response.data.data;
        setFormData({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate.split('T')[0],
          priority: task.priority
        });
      }
    } catch (error) {
      console.error('Error fetching task:', error);
      navigate('/');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else if (new Date(formData.dueDate) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      let response;
      if (isEdit) {
        response = await tasksAPI.updateTask(id, formData);
      } else {
        response = await tasksAPI.createTask(formData);
      }
      if (response.data.success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error saving task:', error);
      const message = error.response?.data?.message || 'Error saving task';
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-container">
      <div className="form-header">
        <Link to="/" className="btn btn-secondary">&larr; Back to Tasks</Link>
        <h1>{isEdit ? 'Edit Task' : 'Create New Task'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Task Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'error' : ''}
            placeholder="Enter task title"
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className={errors.description ? 'error' : ''}
            placeholder="Enter task description"
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dueDate">Due Date *</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={errors.dueDate ? 'error' : ''}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
          </div>

          {/* ✅ NEW PRIORITY UI */}
          <div className="form-group">
            <label>Priority</label>
            <div className="priority-options">
              {['high', 'medium', 'low'].map(priority => (
                <div
                  key={priority}
                  className={`priority-option ${priority} ${formData.priority === priority ? 'selected' : ''}`}
                  onClick={() => handleChange({
                    target: { name: 'priority', value: priority }
                  })}
                >
                  <div
                    className="priority-indicator"
                    style={{
                      backgroundColor: PRIORITY_COLORS[priority],
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      margin: '0 auto 0.5rem',
                      border: formData.priority === priority ? '2px solid white' : '2px solid transparent',
                      boxShadow: formData.priority === priority ? '0 0 0 2px currentColor' : 'none'
                    }}
                  ></div>
                  {PRIORITY_LABELS[priority]}
                </div>
              ))}
            </div>
          </div>
        </div> {/* ✅ properly closed form-row */}

        {errors.submit && (
          <div className="error-message submit-error">{errors.submit}</div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading
              ? (isEdit ? 'Updating...' : 'Creating...')
              : (isEdit ? 'Update Task' : 'Create Task')}
          </button>
          <Link to="/" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
