const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL is not set");
        }

        await mongoose.connect(process.env.MONGO_URL, {
            connectTimeoutMS: 10000,
            serverSelectionTimeoutMS: 5000,
        });
        console.log("✅ Database connected successfully");
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        console.error("Detailed error:", error);
        throw error;
    }
};

module.exports = connectDB;
