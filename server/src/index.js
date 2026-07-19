const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const testRoutes = require('./routes/tests');
const resultRoutes = require('./routes/results');
const mistakeRoutes = require('./routes/mistakes');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const { connectDB } = require('./db');
const seed = require('./seed/seed');
const Question = require('./models/Question');

async function startServer() {
  await connectDB();

  // Auto-seed if database is empty (no questions)
  try {
    const qCount = await Question.countDocuments();
    if (qCount === 0) {
      console.log('✏️ Database is empty. Running auto-seeding...');
      await seed(true);
    } else {
      console.log(`📊 Found ${qCount} questions in database. Skipping auto-seed.`);
    }
  } catch (err) {
    console.error('❌ Failed to run auto-seed checks:', err.message);
  }
}
startServer();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/mistakes', mistakeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/gamification', require('./routes/gamification'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'TestHub API is running', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
