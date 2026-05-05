const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const interviewRouter = express.Router();
const interviewController = require("../controllers/interviewController");
const upload = require("../middlewares/fileMiddleware");


/** * @route POST /api/interview/
 * @description Generate interview report based on resume, job description, and self-description
 * @access Private
 *
*/
interviewRouter.post("/", authMiddleware, upload.single("resume"), interviewController.generateInterviewReportController);





module.exports = interviewRouter;