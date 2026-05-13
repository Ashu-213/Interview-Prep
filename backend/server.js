require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/database");

// Validate required environment variables
const requiredEnvVars = ["MONGO_URL", "OPENROUTER_API_KEY"];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error("❌ FATAL: Missing required environment variables:");
    missingVars.forEach(varName => {
        console.error(`   - ${varName}`);
    });
    console.error("\nPlease set these variables in your .env file");
    console.error("See .env.example for reference");
    process.exit(1);
}

// Warn about API_REFERER if not set
if (!process.env.API_REFERER && process.env.NODE_ENV === 'production') {
    console.warn("⚠️  WARNING: API_REFERER not set for production");
    console.warn("   OpenRouter API may reject requests. Set API_REFERER to your deployed domain.");
}

//start the server
const PORT = process.env.PORT || 3000;
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        process.exit(1);
    }
};
startServer();


