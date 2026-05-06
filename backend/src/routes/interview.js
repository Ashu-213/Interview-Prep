const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const interviewRouter = express.Router();
const interviewController = require("../controllers/interviewController");
const upload = require("../middlewares/fileMiddleware");


/** 
 * @route POST /api/interview/
 * @description Generate interview report based on resume, job description, and self-description
 * @access Private
 *
*/
interviewRouter.post("/", authMiddleware, upload.single("resume"), interviewController.generateInterviewReportController);


/**
 * @route GET /api/interview/report/:interviewId
 * @description Get interview report by interview ID
 * @access Private
 *
*/
interviewRouter.get("/report/:interviewId", authMiddleware, interviewController.getInterviewReportController);


/**
 * @route GET /api/interview/
 * @description Get all interview reports of logged in user
 * @access Private
 */
interviewRouter.get("/", authMiddleware, interviewController.getAllInterviewReportsController);

module.exports = interviewRouter;