import mongoose from "mongoose";

/**
 * Connect to MongoDB database using Mongoose
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/yuwa_portal";
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️ Warning: Error connecting to MongoDB: ${error.message}`);
    console.warn(`Server will run anyway (mock/offline mode supported for testing).`);
    return null;
  }
};

export default connectDB;
export { connectDB };

