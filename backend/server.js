const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running!' });
});

// Routes
console.log("Loading auth routes...");
const authRoutes = require('./routes/auth');

console.log("Loading task routes...");
const taskRoutes = require('./routes/tasks-clean');

console.log("Loading analytics routes...");
const analyticsRoutes = require('./routes/analytics');

console.log("Loading error handler...");
const errorHandler = require('./middleware/errorHandler');
app.use('/api/auth', authRoutes);
app.use('/api/tasks-clean', taskRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

