const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user analytics
router.get('/', auth, async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments({ user: req.user._id });
    const completedTasks = await Task.countDocuments({ user: req.user._id, status: 'Done' });
    const pendingTasks = totalTasks - completedTasks;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Tasks by status
    const tasksByStatus = await Task.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Tasks by priority
    const tasksByPriority = await Task.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Overdue tasks
    const overdueTasks = await Task.countDocuments({
      user: req.user._id,
      status: { $ne: 'Done' },
      dueDate: { $lt: new Date() }
    });

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      completionPercentage,
      overdueTasks,
      tasksByStatus,
      tasksByPriority,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

