import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("MongoDB Connection Success"))
        await mongoose.connect(process.env.MONGODB_URL);
    } catch (err) {
        console.error("MongoDB Connection Failed:", err.message);
    }
};