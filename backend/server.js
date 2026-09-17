const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB();

// Start listening for incoming HTTP requests
const server = app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`YUWA Backend Server running on port ${PORT}`);
  console.log(`Test URL: http://localhost:${PORT}`);
  console.log(`========================================`);
});

module.exports = server;
