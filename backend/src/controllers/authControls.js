const model = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklistUser");

const isProduction = process.env.NODE_ENV === "production";
const authCookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 24 * 60 * 60 * 1000
};

//register controller
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const isUserExists = await model.findOne({ $or: [{ email }, { username }] });
        if (isUserExists) {
            return res.status(400).json({ error: "User already exists" });
        }

        //hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await model.create({ username, email, password: hashedPassword });
        console.log("✅ User created:", user);

        //Generating the token
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" });

        //setting the cookie
        res.cookie("token", token, authCookieOptions);
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("❌ Registration error:", error);
        res.status(500).json({ error: error.message });
    }
};

//login controller
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        //finding the user
        const user = await model.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        //comparing the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }

        //Generating the token
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" });

        //setting the cookie
        res.cookie("token", token, authCookieOptions);

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//logout controller
const logout = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).json({ error: "No token found" });
    }

    //blacklisting the token
    await blacklistModel.create({ token });

    //clearing the cookie
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction
    });
    res.status(200).json({ message: "User logged out successfully" });

};

//getMe controller
const getMe = async (req, res) => {
    try {
        const user = await model.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    register,
    login,
    logout,
    getMe
}


