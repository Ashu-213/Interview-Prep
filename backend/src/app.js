const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5000",
    credentials: true
}));

//require routes
const authRouter = require("./routes/auth");
const interviewRouter = require("./routes/interview");

//use routes
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);



module.exports = app;
