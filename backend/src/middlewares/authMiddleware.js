const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklistUser");


// Middleware to authenticate and authorize users based on JWT tokens
const authMiddleware = async (req, res, next) => {

    // Support both Authorization header and cookie-based token
    const authHeader = req.header("Authorization");
    let token = null;

    if (authHeader) {
        token = authHeader.startsWith("Bearer ")
            ? authHeader.slice(7).trim()
            : authHeader.trim();
    }

    if (!token && req.cookies?.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Check if the token is blacklisted
    const isBlacklisted = await blacklistModel.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ message: "Token is invalid." });
    }

    // Verify the token and decode the payload
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token." });
    }
};

module.exports = authMiddleware;