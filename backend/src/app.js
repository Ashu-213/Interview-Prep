const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5000,http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: (origin, callback) => {
        // Allow server-to-server and same-origin requests with no Origin header.
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));

//require routes
const authRouter = require("./routes/auth");
const interviewRouter = require("./routes/interview");

//use routes
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);



module.exports = app;
