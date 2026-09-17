const express = require('express');
const cors = require('cors');

// Initialize the Express application
const app = express();

// Core Middleware
app.use(cors()); // Allows frontend apps on other ports/domains to communicate with this API
app.use(express.json()); // Parses incoming requests with JSON payloads into req.body

// Basic Health Check Route (used to verify the server is running)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'YUWA Impact & Evaluation Portal API is running',
    timestamp: new Date().toISOString()
  });
});

// Resource Routes
const schoolRoutes = require('./routes/schoolRoutes');
const participantRoutes = require('./routes/participantRoutes');
const activityRoutes = require('./routes/activityRoutes');

app.use('/api/schools', schoolRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/activities', activityRoutes);

// Error Handling Middlewares (must be registered after routes)
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

app.use(notFound);
app.use(errorHandler);

module.exports = app;
