const pdfParse = require("pdf-parse");
const { generateInterviewReport } = require("../services/aiServices");
const interviewReportModel = require("../models/interviewReport");


/**
 * @desc Extract a best-guess job title from a job description string
 */
function extractJobTitle(jobDescription) {
    // Try to find "Job Title: X" pattern
    const titleMatch = jobDescription.match(/job\s+title[:\s]+([^\n]+)/i);
    if (titleMatch) return titleMatch[1].trim();
    // Try to find "Position: X" pattern
    const posMatch = jobDescription.match(/position[:\s]+([^\n]+)/i);
    if (posMatch) return posMatch[1].trim();
    // Fall back to first non-empty line
    const firstLine = jobDescription.split('\n').find(l => l.trim().length > 3);
    return firstLine ? firstLine.trim().substring(0, 80) : "Interview Report";
}


/**
 * @desc controller to generate interview report
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

        if (!resumeText || resumeText.trim().length < 50) {
            return res.status(400).json({ error: "Could not read text from the PDF. Please ensure it is a text-based PDF." });
        }

        // Generate report via AI
        const aiReport = await generateInterviewReport({
            sampleResume: resumeText,
            jobDescription,
            selfDescription: selfDescription || ""
        });

        console.log("AI report fields:", Object.keys(aiReport));
        console.log("title:", aiReport.title, "| score:", aiReport.overallScore);

        // Defensive fallbacks for every field
        const title = (aiReport.title && aiReport.title.trim()) || extractJobTitle(jobDescription);
        const overallScore = (typeof aiReport.overallScore === "number") ? aiReport.overallScore : 50;
        const technicalQuestions = Array.isArray(aiReport.technicalQuestions) ? aiReport.technicalQuestions : [];
        const behavioralQuestions = Array.isArray(aiReport.behavioralQuestions) ? aiReport.behavioralQuestions : [];
        const skillGaps = Array.isArray(aiReport.skillGaps) ? aiReport.skillGaps : [];
        const preparationPlan = Array.isArray(aiReport.preparationPlan) ? aiReport.preparationPlan : [];

        // Save to DB
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            jobDescription,
            selfDescription: selfDescription || "",
            overallScore,
            title,
            technicalQuestions,
            behavioralQuestions,
            skillGaps,
            preparationPlan,
        });

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });
    } catch (error) {
        console.error("❌ Error generating interview report:", error.message);
        console.error(error.stack);
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

        res.status(200).json({ message: "Interview report fetched successfully", interviewReport });
    } catch (error) {
        console.error("❌ Error fetching interview report:", error.message);
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

        res.status(200).json({ message: "Interview reports fetched successfully", interviewReports });
    } catch (error) {
        console.error("❌ Error fetching all interview reports:", error.message);
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController
};
