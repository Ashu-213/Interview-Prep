const { Router } = require("express");                //Destructuring
const authRouter = Router();
const authController = require("../controllers/authControls");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
*/
authRouter.post("/register", authController.register);

/**
 * @route POST /api/auth/login
 * @description Login a user
 * @access Public
 */
authRouter.post("/login", authController.login);

/**
 * @route GET /api/auth/logout
 * @description Logout a user
 * @access Public
 */
authRouter.get("/logout", authController.logout);

/**
 * @route GET /api/auth/getMe
 * @description Get the current loggedin user's profile
 * @access Private
 */
authRouter.get("/getMe", authMiddleware, authController.getMe);
 



module.exports = authRouter;
