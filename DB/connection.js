/* import mongoose from 'mongoose';
export const connectDB =async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);;
        console.log('MongoDB connected successfully');
    }
    catch(error){
        console.error('MongoDB connection failed:', error.message);
    }
} */
/* 
    import mongoose from "mongoose";

let isConnected = null; // عشان نحتفظ بالـ connection global

export const connectDB = async () => {
  if (isConnected) {
    console.log("✅ Using existing MongoDB connection");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // timeout أسرع
    });

    isConnected = conn.connections[0].readyState; // 1 = connected
    console.log(" MongoDB connected successfully");
  } catch (error) {
    console.error(" MongoDB connection failed:", error.message);
    throw new Error("Database connection failed");
  }
};
 */

import mongoose from "mongoose";

let isConnected = null; // عشان نحتفظ بالـ connection global

export const connectDB = async () => {
  if (isConnected) {
    console.log("✅ Using existing MongoDB connection");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      serverSelectionTimeoutMS: 5000, // timeout أسرع
    });

    isConnected = conn.connections[0].readyState; // 1 = connected
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw new Error("Database connection failed");
  }
};
