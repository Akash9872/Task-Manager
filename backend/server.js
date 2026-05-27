const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

// Must run before any models / routes are required (they register with mongoose)
mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 60000);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const dashboardRoutes = require('./routes/dashboard');
const chatRoutes = require('./routes/chat');
const notificationRoutes = require('./routes/notifications');

// Ensure upload directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve attachments
app.use('/uploads', express.static(uploadsDir));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);

// Basic health check (no DB)
app.get('/api/health', (req, res) => {
  const dbOk = mongoose.connection.readyState === 1;
  res.json({
    status: 'Server is running',
    database: dbOk ? 'connected' : 'not connected',
  });
});

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/team-task-manager';

const mongoOptions = {
  // Connection-level: same as mongoose.set, but explicit for this connection
  bufferCommands: false,
  bufferTimeoutMS: 60000,
  serverSelectionTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  // Prefer IPv4 — fixes some Windows + Atlas "buffering" / selection failures
  family: 4,
};

mongoose
  .connect(MONGODB_URI, mongoOptions)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, HOST, () => {
      console.log(`API listening on port ${PORT}`);
      console.log(`  Health:  http://127.0.0.1:${PORT}/api/health`);
      console.log(`  Base:    http://127.0.0.1:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error('\nMongoDB connection failed:', err.message);
    console.error(
      '\nFix this before using the app:\n' +
        '  • Start MongoDB on your computer (Windows: Services → MongoDB),\n' +
        '    OR\n' +
        '  • Use MongoDB Atlas (free): https://www.mongodb.com/cloud/atlas\n' +
        '    then set MONGODB_URI in backend/.env to your connection string.\n' +
        '\nIf you use Atlas: Network Access → allow your IP (or 0.0.0.0/0 for testing).\n' +
        'Remove short timeouts from the URI (e.g. serverSelectionTimeoutMS=1000) if present.\n'
    );
    process.exit(1);
  });
