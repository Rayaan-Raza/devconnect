const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');

// Load env vars
dotenv.config();

const app = express();

// Ensure DB is connected before handling any request (serverless-safe)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use('/api', limiter);

// Sanitize data
app.use(mongoSanitize());

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Serve static files (demo HTML pages, etc.)
const path = require('path');
app.use('/public', express.static(path.join(__dirname, 'public')));

// Route files
const auth = require('./routes/auth');
const projects = require('./routes/projects');
const students = require('./routes/students');
const companies = require('./routes/companies');
const jobs = require('./routes/jobs');
const messages = require('./routes/messages');
const admin = require('./routes/admin');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/projects', projects);
app.use('/api/students', students);
app.use('/api/companies', companies);
app.use('/api/jobs', jobs);
app.use('/api/messages', messages);
app.use('/api/admin', admin);

// Home route
app.get('/', (req, res) => {
  res.send('DevConnect API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });

  process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
  });
}

module.exports = app;
