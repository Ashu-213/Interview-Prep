const pdfParseLib = require("pdf-parse");
const pdfParse = pdfParseLib.default || pdfParseLib;
const { generateInterviewReport } = require("../services/aiServices");
const interviewReportModel = require("../models/interviewReport");


/**
 * @desc controller to generate interview report based on resume, job description and self description
 */
async function generateInterviewReportController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Resume file is required" });
        }

        const jobDescription = req.body.jobDescription;
        const selfDescription = req.body.selfDescription;

        if (!jobDescription) {
            return res.status(400).json({ error: "Job description is required" });
        }

        // Parse the uploaded PDF buffer
        const pdfData = await pdfParse(req.file.buffer);
        const resumeText = pdfData.text;

        // Generate report via AI
        const aiReport = await generateInterviewReport({
            sampleResume: resumeText,
            jobDescription,
            selfDescription: selfDescription || ""
        });

        // Save to DB — map AI fields to schema fields
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            jobDescription,
            selfDescription: selfDescription || "",
            overallScore: aiReport.overallScore,
            title: aiReport.title,
            technicalQuestions: aiReport.technicalQuestions,
            behavioralQuestions: aiReport.behavioralQuestions,
            skillGaps: aiReport.skillGaps,
            preparationPlan: aiReport.preparationPlan,
        });

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });
    } catch (error) {
        console.error("❌ Error generating interview report:", error);
        res.status(500).json({ error: error.message });
    }
}


/**
 * @desc controller to get interview report by interview ID
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found" });
        }

        res.status(200).json({
            message: "Interview report fetched successfully",
            interviewReport
        });
    } catch (error) {
        console.error("❌ Error fetching interview report:", error);
        res.status(500).json({ error: error.message });
    }
}


/**
 * @desc controller to get all interview reports of a logged-in user
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -jobDescription -selfDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

        res.status(200).json({
            message: "Interview reports fetched successfully",
            interviewReports
        });
    } catch (error) {
        console.error("❌ Error fetching all interview reports:", error);
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController
};
