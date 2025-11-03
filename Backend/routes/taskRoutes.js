const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskPriority
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { handleValidationErrors } = require('../middleware/validationMiddleware');

const router = express.Router();

// Validation rules
const taskValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot be more than 100 characters'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Description cannot be more than 500 characters'),
  body('dueDate')
    .isISO8601()
    .withMessage('Please provide a valid due date'),
  body('priority')
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high')
];

// All routes are protected
router.use(protect);

router.route('/')
  .get(getTasks)
  .post(taskValidation, handleValidationErrors, createTask);

router.route('/:id')
  .get(getTask)
  .put(taskValidation, handleValidationErrors, updateTask)
  .delete(deleteTask);

router.patch('/:id/status', 
  body('status').isIn(['pending', 'completed']).withMessage('Status must be pending or completed'),
  handleValidationErrors,
  updateTaskStatus
);

router.patch('/:id/priority',
  body('priority').isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  handleValidationErrors,
  updateTaskPriority
);

module.exports = router;