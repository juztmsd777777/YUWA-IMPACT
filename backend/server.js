import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

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

export default server;

